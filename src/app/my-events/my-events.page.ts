import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, collectionGroup } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {
  misEventos: any[] = [];
  userId: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private router: Router
    ) {}

  ngOnInit() {
    const auth = getAuth();
    if (auth.currentUser) {
      this.userId = auth.currentUser.uid;
      this.obtenerMisEventos();
    }
  }
  async obtenerMisEventos() {
    if (!this.userId) {
      return;
    }

    const q = query(collection(getFirestore(), 'events'), where('userId', '==', this.userId));
    const querySnapshot = await getDocs(q);

    this.misEventos = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  }

  async obtenerInvitados(eventoId: string) {
    const q = collectionGroup(getFirestore(), 'invitados');
    const querySnapshot = await getDocs(q);
  
    const invitadosEvento = querySnapshot.docs
      .filter((doc) => doc.data()['eventoId'] === eventoId)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
  
  
    // Navegar a la página de invitados con el eventoId incluido en la URL
    this.router.navigate(['/mis-invitados', eventoId, { invitados: JSON.stringify(invitadosEvento) }]);
  }

  async deleteEvent(eventoId: string) {
    try {
      // Eliminar el evento de la colección 'events'
      await this.firestore.collection('events').doc(eventoId).delete();

      // Volver a cargar la lista de eventos después de la eliminación
      await this.obtenerMisEventos();

      // Mostrar un mensaje de éxito o realizar otras acciones si es necesario
      console.log('Evento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      // Mostrar un mensaje de error o realizar otras acciones si es necesario
    }
  }
}
