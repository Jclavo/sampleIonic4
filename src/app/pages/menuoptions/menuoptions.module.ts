import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuoptionsPageRoutingModule } from './menuoptions-routing.module';

import { MenuoptionsPage } from './menuoptions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuoptionsPageRoutingModule
  ],
  declarations: [MenuoptionsPage]
})
export class MenuoptionsPageModule {}
