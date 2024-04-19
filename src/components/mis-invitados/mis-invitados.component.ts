import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mis-invitados',
  templateUrl: './mis-invitados.component.html',
  styleUrls: ['./mis-invitados.component.scss'],
})
export class MisInvitadosComponent  implements OnInit {
  invitados: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.invitados = this.route.snapshot.paramMap.get('invitados') ? JSON.parse(this.route.snapshot.paramMap.get('invitados')!) : [];
    console.log('Invitados:', this.invitados);
  }
}
