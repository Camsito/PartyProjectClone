import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getFirestore, collection, doc, addDoc, FirestoreError, getDoc, getDocs, collectionGroup } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { map } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';
import { GeocodingService } from 'src/Service/Geoencoder/geocoding.service';
import { WhatsappService } from 'src/Service/Whatsapp/whatsapp.service';

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
  userPhone='';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private geocodingService: GeocodingService,
    private whatsappService: WhatsappService
  ) {}

  ngOnInit() {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
     this.getUserInfo(uid).then((info: any) => {
      this.userIds = uid;
      this.invitadoName = info.name
      this.userPhone =info.phone_number
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
        this.showAlert('Aviso', 'Ya estás en la lista de invitados.');
      } else {
        // Obtener información del evento, incluyendo la comuna
        getDoc(doc(collection(getFirestore(), 'events'), eventoId))
        .then((eventSnapshot) => {
          if (eventSnapshot.exists()) {
            const eventoCompleto = eventSnapshot.data();
            const anfitrionId = eventoCompleto['userId'];
            const direccion = eventoCompleto['direccion']; // Obtener la dirección del evento
            const comuna = eventoCompleto['comuna']; // Obtener la comuna del evento
            const address = `${direccion}, ${comuna}`; // Concatenar la dirección y la comuna
  
            console.log('Dirección completa del evento:', address); // Mostrar la dirección completa en la consola
            this.showAlert('Aviso', 'Seras dirigido a google maps');
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
                  this.showAlert('Aviso', 'Haz sido incluido en la lista de invitados.');
                  this.showAlert2('Aviso', '¿Deseas ser agregado a un grupo de whatsapp en donde se mostrara tu numero de celular?');
                  this.showAlert('aviso', 'nombre: '+ this.invitadoName);
                  // Abrir la dirección en Google Maps
                  this.openLocationInMaps(address);
                })
                .catch((error: FirestoreError) => {
                  console.error('Error al agregar:', error);
                  this.showAlert('Error', 'Error al agregar');
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
  async showAlert2(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel', // Esto cierra el alerta cuando se hace clic en este botón
          handler: () => {
            console.log('No clickeado');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            console.log('Sí clickeado');
            // Puedes agregar aquí la lógica que desees ejecutar cuando se haga clic en el botón "Sí"
          }
        }
      ]
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


  openLocationInMaps(address: string) {
    this.geocodingService.getCoordinates(address).subscribe((data: any) => {
      if (data && data.results && data.results.length > 0 && data.results[0].geometry) {
        const location = data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_system');
      } else {
        console.error('No se pudo obtener la ubicación desde la API de geocodificación de Google Maps');
        // Puedes mostrar un mensaje de error o manejar el caso de error de alguna otra manera
      }
    });
  }
}
