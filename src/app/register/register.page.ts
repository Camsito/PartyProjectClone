import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, FirestoreError, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  name = '';
  email = '';
  password = '';
  repeatPass = '';
  direccion = '';
  comuna = '';
  telefono = '';

  ngOnInit() {
  }

  onSubmit() {
    if (this.password === this.repeatPass) {
      this.auth.createUserWithEmailAndPassword(this.email, this.password).then((result) => {
        if (result) {
          const auth = getAuth();
          const userID = auth.currentUser?.uid;

          const firestore = getFirestore();
          const user = {
            name: this.name,
            email: this.email,
            address: this.direccion,
            comuna: this.comuna,
            phone_number: this.telefono,
          };

          setDoc(doc(collection(firestore, "users"), userID), user)
            .then(() => {
              alert('usuario registrado exitosamente.');
              this.router.navigate(['/home']);
            })
            .catch((error: FirestoreError) => {
              console.error('Error adding user data to Firestore:', error);
              alert('Error al registrar usuario. Por favor, inténtelo de nuevo.');
            });
        }
      })
      .catch((error) => {
        alert('Ingrese un correo valido');
      });
    } else {
      alert("Las contraseñas no coinciden");
    }
  }

  back() {
    this.router.navigate(['/home'])
  }
}
