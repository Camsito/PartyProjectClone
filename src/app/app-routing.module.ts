import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/components/components.module';
import { MisInvitadosComponent } from 'src/components/mis-invitados/mis-invitados.component'; 
import { AuthLogGuard } from 'src/guard/authLog/auth-log.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot-pass',
    loadChildren: () => import('./forgot-pass/forgot-pass.module').then( m => m.ForgotPassPageModule)
  },
  {
    path: 'start-page',
    loadChildren: () => import('./start-page/start-page.module').then( m => m.StartPagePageModule), 
    canActivate:[AuthLogGuard]
  },
  {
    path: 'add-event',
    loadChildren: () => import('./add-event/add-event.module').then( m => m.AddEventPageModule), 
    canActivate:[AuthLogGuard]
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./cuenta/cuenta.module').then( m => m.CuentaPageModule), 
    canActivate:[AuthLogGuard]
  },
  {
    path: 'my-events',
    loadChildren: () => import('./my-events/my-events.module').then( m => m.MyEventsPageModule), 
    // canActivate:[AuthLogGuard]
  },
  {
     path: 'mis-invitados/:eventoId', component: MisInvitadosComponent, 
     canActivate:[AuthLogGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }), ComponentsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
