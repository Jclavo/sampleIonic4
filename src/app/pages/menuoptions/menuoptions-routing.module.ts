import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuoptionsPage } from './menuoptions.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: MenuoptionsPage,
    children: [
      {
        path: 'main',
        loadChildren: () => import('../main/main.module').then(m => m.MainPageModule)
      },
      // {
      //   path: 'main/details',
      //   loadChildren: '../details/details.module#DetailsPageModule'
      // },
      {
        path: 'config',
        //loadChildren: '../config/config.module#ConfigPageModule'
        loadChildren: () => import('../config/config.module').then(m => m.ConfigPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'employee',
        loadChildren: () => import('../employee/employee.module').then(m => m.EmployeePageModule)
      },
      {
        path: 'employee/:employe_id',
        loadChildren: () => import('../employee/employee.module').then(m => m.EmployeePageModule)
      },

    ]
  },
  {
    path: '',
    redirectTo: 'tabs/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuoptionsPageRoutingModule { }
