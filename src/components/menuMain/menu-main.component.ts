import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

interface menuItems {
 label: string;
 icon: string;
 destination: string;
}
@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.scss'],
})
export class MenuMainComponent  implements OnInit {
  menuItems: menuItems[] = [
    { label: 'Inicio', icon: 'Home', destination: 'start-page' },
    { label: 'Cuenta', icon: 'person', destination: 'cuenta' },
    { label: 'Cerrar Sesión', icon: 'exit', destination: 'home' }
  ];

  constructor(
    private router: Router,
    private menuController: MenuController
  ) { }

  ngOnInit() {}

  irA(destino: string) {
    const rutasValidas = ['cuenta', 'start-page', 'home'];

    if (rutasValidas.includes(destino)) {
      this.router.navigate([destino]);
    } 
  }

  cerrarMenu() {
    this.menuController.close();
  }

  logout() {
  }
}
