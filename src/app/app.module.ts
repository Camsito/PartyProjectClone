import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { DatePipe } from '@angular/common';
import { ComponentsModule } from 'src/components/components.module';
import { AuthLogGuard } from 'src/guard/authLog/auth-log.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebase),ComponentsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },DatePipe,AuthLogGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
