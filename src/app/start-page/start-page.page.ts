import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getFirestore, collection, doc, addDoc, FirestoreError, getDoc, getDocs, collectionGroup } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { map } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.page.html',
  styleUrls: ['./start-page.page.scss'],
})
export class StartPagePage implements OnInit {
  eventos: any[] = [];
  fechaFormateada: string | null = '';
  userIds = '';
  invitadoName= '';
  eventId:any ;
  anfiId = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
     this.getUserInfo(uid).then((info: any) => {
      this.userIds = uid;
      this.invitadoName = info.name
    });
    }

    this.firestore.collection('events').snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data() as any;
          return { id, ...data };
        });
      })
    ).subscribe(eventos => {
      if (eventos.length > 0) {
        this.eventos = eventos;
        this.asignarColoresAleatorios();
      } else {
        this.showAlert('Aviso','No se encuentran eventos')
      }
    });
  }

  asignarColoresAleatorios() {
    const colores = ["#81a6d9", "#3d4e90"];
    const numColores = colores.length;
  
    this.eventos.forEach((evento, index) => {
      const colorIndex = index % numColores;
      const color = colores[colorIndex];
      const colorConTransparencia = this.agregarTransparencia(color, 0.1);
      evento.color = colorConTransparencia;
    });
  }
  
  agregarTransparencia(color: string, transparencia: number): string {
    const rgbaColor = this.hexToRgb(color);
    return `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${transparencia})`;
  }
  
  hexToRgb(hex: string): { r: number, g: number, b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }
  
  handleRefresh(event: any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  addevent() {
    this.router.navigate(['/add-event']);
  }

  Attendo(evento: any) {
    const eventoId = evento.id;
    // Almacenar el valor actual de this.userIds en una variable local
    const userId = this.userIds;
    // Consultar la subcolección de invitados del evento
    const invitadosCollectionRef = collection(getFirestore(), 'events', eventoId, 'invitados');
    // Verificar si el usuario ya está en la lista de invitados
    getDocs(invitadosCollectionRef).then((invitadosSnapshot) => {
      const yaEstaEnLaLista = invitadosSnapshot.docs.some(doc => doc.data()['Invitado'] === userId);
  
      if (yaEstaEnLaLista) {
        this.showAlert('Aviso','Ya estás en la lista de invitados.');
        
      } else {
        // Obtener información del evento
        getDoc(doc(collection(getFirestore(), 'events'), eventoId))
        .then((eventSnapshot) => {
          if (eventSnapshot.exists()) {
            const eventoCompleto = eventSnapshot.data();
            const anfitrionId = eventoCompleto['userId'];
  
            //Eliminar esto al terminar esta pagina
            
            console.log('Evento ID:', eventoId);
            console.log('Anfitrión ID (userId):', anfitrionId);
            console.log('User ID:', userId);
            console.log('User Name: ', this.invitadoName);
  
            const listaInvitados = {
              Invitado: userId,
              invitado: this.invitadoName,
              eventoId: eventoId,
              anfitrionId: anfitrionId
            };
  
            if (userId != anfitrionId) {
              // Agregar al usuario a la lista de invitados
              addDoc(invitadosCollectionRef, listaInvitados)
                .then((docRef) => {
                  this.showAlert('Aviso','Haz sido incluido en la lista de invitados.');
                  
                })
                .catch((error: FirestoreError) => {
                  console.error('Error al agregar:', error);
                  this.showAlert('Error','Error al agregar');
                });
            } else {
              //Poner mensaje temporal
              this.mostrarMensaje('No puedes asistir a tu propio evento.', 2000, 'top', 'primary')
            }
          } else {
            this.mostrarMensaje('El evento ya no existe o fue eliminado.',2000, 'top', 'primary')
          }
        })
        .catch((error) => {
          console.error('Error al obtener el evento:', error);
        });
      }
    });
  }
  
  


  


  getUserInfo(uid: string): Promise<any> {
    return getDoc(doc(collection(getFirestore(), 'users'), uid)).then((doc: any) => {
      this.userIds = uid
      return doc.exists ? doc.data() : null;
    });
  }




myEvent(){
  this.router.navigate(['/my-events'])
}
nuntiare(){



  }


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['¡Entendido!']
    });

    await alert.present();
  }

  async mostrarMensaje(mensaje: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'top', color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration,
      position,
      color, 
    });
    toast.present();
  }
}
