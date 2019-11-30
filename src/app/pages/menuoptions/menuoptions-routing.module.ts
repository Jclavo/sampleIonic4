import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuoptionsPage } from './menuoptions.page';

const routes: Routes = [
  {
    path: '',
    component: MenuoptionsPage,
    children: [
      {
        path: 'main',
        loadChildren: '../main/main.module#MainPageModule'
      },
      {
        path: 'main/details',
        loadChildren: '../details/details.module#DetailsPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuoptionsPageRoutingModule {}
