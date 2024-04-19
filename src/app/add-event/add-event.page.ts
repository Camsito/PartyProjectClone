import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getFirestore, collection, doc, addDoc, FirestoreError, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}
  userId = '';
  name = '';
  email = '';
  direccion = '';
  comuna='';
  telefono = '';
  title = '';
  date = '';
  time = '';
  estiloDeMusica = '';
  limiteDePersonas = 0;
  reglasSeleccionadas= []; 
  limiteDeEdad = 0; 
  aporteMinimo = 0;
  numeroDeAcompanantes = 0;

  edadOptions = Array.from({ length: 73 }, (_, i) => ({
    value: i + 18,
    label: `${i + 18}`
  }));
  
  
  ngOnInit() {
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
      this.router.navigate(['/home']);
      return;
    }



    this.getUserInfo(uid).then((info: any) => {
      this.name = info.name;
      this.email = info.email;
      this.direccion = info.address;
      this.comuna = info.comuna;
      this.telefono = info.phone_number;
    });
  }



  onSubmit() {
    const eventoFirestore = {
      userId: this.userId,
      title: this.title,
      date: this.date,
      time: this.time,
      estiloDeMusica: this.estiloDeMusica,
      limiteDePersonas: this.limiteDePersonas,
      reglasSeleccionadas: this.reglasSeleccionadas,
      limiteDeEdad: this.limiteDeEdad,
      aporteMinimo: this.aporteMinimo,
      numeroDeAcompañantes: this.numeroDeAcompanantes,
      name: this.name,
      email: this.email,
      direccion: this.direccion,
      comuna: this.comuna,
      telefono: this.telefono,
    };
    if (!eventoFirestore.title ) {
      // Display error message
      alert('Please provide a title for the event.');
      return;
    }

    addDoc(collection(getFirestore(), 'events'), eventoFirestore)
    .then((docRef) => {
      // Navigate to events page
      this.mostrarMensaje('Evento añadido exitosamente.', 2000, 'top', 'primary')
      this.router.navigate(['/start-page']);
    }, (error: FirestoreError) => {
      // Handle error
      console.error('Error adding event:', error);
      alert('An error occurred while adding the event. Please try again.');
      this.mostrarMensaje('Error al añadir Evento', 2000, 'top', 'danger')
    });
  }

  getUserInfo(uid: string): Promise<any> {
    return getDoc(doc(collection(getFirestore(), 'users'), uid)).then((doc: any) => {
      this.userId = uid
      return doc.exists ? doc.data() : null;
    });
  }

  async mostrarMensaje(mensaje: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'top', color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration,
      position,
      color,
      cssClass: 'texto-centrado' // Agregamos la clase personalizada al toast
    });
    toast.present();
  }

  onBack(){
    this.navCtrl.back();
  }
}