import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email = '';
  password = '';
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private toastController: ToastController
  ) {}



  onSubmit() {
    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        if(result){
        this.mostrarMensaje('Acceso concedido, Bienvenido a P.A.R.T.Y', 2000,'top')
        this.router.navigate(['/start-page'])
        }else{
          this.mostrarMensaje('Acceso denegado. Credenciales invalidas o vacias', 2000,'top', 'danger')
        }
      })
      .catch(({error, result}) => {
        if(!result){
          this.mostrarMensaje('Acceso denegado. Credenciales invalidas o vacias', 2000,'top', 'danger')
        }
      });
  }
  navigateAccount(){
    this.router.navigate(['/register'])
  }

  navigateForgot(){
    this.router.navigate(['/forgot-pass'])
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

  startpage(){
    this.router.navigate(['/start-page'])
  }
  myevent(){
    this.router.navigate(['/my-events'])
  }


}
