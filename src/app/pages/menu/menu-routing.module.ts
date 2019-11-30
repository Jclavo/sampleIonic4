import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'options',
        //loadChildren: '../menuoptions/menuoptions.module#MenuoptionsPageModule'
        loadChildren: () => import('../menuoptions/menuoptions.module').then( m => m.MenuoptionsPageModule)
      },
      {
        path: 'minhaconta',        
        loadChildren: '../minhaconta/minhaconta.module#MinhacontaPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
