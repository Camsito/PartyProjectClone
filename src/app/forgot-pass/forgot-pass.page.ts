import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {
  email= '';

  constructor(
    private auth: AngularFireAuth,
    private router: Router
    ) {}

  ngOnInit() {
  }

  onSubmit() {
    console.log('este es el correo', this.email)
    this.auth.sendPasswordResetEmail(this.email)
      .then((result) => {
        alert('Correo enviado exitosamente.');
        this.router.navigate(['/home'])
      })
      .catch((error) => {
        if (error.code === 'auth/missing-email') {
          alert('Por favor, ingresa un correo electrónico válido.');
        } else {
          alert('Error al enviar el correo electrónico.');
          console.error(error);
        }
      });
  }
  
}
