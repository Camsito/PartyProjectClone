import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthLogGuard implements CanActivate {

  constructor(private auth: AngularFireAuth, private router: Router, private toastController: ToastController) { }
  async mostrarMensaje(mensaje: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'top', color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration,
      position,
      color, 
    });
    toast.present();
  }
  

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
        } else {
          this.mostrarMensaje('Debes estar autorizado para ingresar a esta pagina', 2000, 'top', 'danger');
          this.router.navigate(['/home'])
          resolve(false);
        }
      });
    });
  }
  
}