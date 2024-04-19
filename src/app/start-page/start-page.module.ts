import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartPagePageRoutingModule } from './start-page-routing.module';

import { StartPagePage } from './start-page.page';
import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPagePageRoutingModule,
    ComponentsModule
  ],
  declarations: [StartPagePage]
})
export class StartPagePageModule {}
