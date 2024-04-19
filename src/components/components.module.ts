import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuMainComponent } from './menuMain/menu-main.component';
import { MisInvitadosComponent } from './mis-invitados/mis-invitados.component';

@NgModule({
  declarations: [MenuMainComponent, MisInvitadosComponent],
  exports: [MenuMainComponent, MisInvitadosComponent],
  imports: [CommonModule, IonicModule],
})
export class ComponentsModule {}
