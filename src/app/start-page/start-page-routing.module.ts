import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartPagePage } from './start-page.page';
import { ComponentsModule } from 'src/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: StartPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ComponentsModule],
  exports: [RouterModule],
})
export class StartPagePageRoutingModule {}
