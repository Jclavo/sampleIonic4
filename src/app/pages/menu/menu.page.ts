import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
//import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {


  public CodigoUsuarioSistema : string;
  public NomeUsuarioSistema : String; 

  //public AppName: String = environment.AppName;
  public SuporteID: string = "0001";
 // public AppEmailSuporte = environment.AppEmailSuporte;
  //public AppWhatAppSuporte = environment.AppWhatAppSuporte  
  
  private selectedPath = ''; 
  public pages = [
    {
      title: 'Menu Principal',
      url: '/menu/options',
      icon : 'menu'
    },
    {
      title: 'Minha Conta',
      url: '/menu/minhaconta',
      icon : 'person'
    },   
    {
      title: 'Configurações',
      url: '/menu/options/tabs/config',
      icon : 'settings'
    }     
  ]; 
  constructor(
      public plt: Platform,      
      //private document: DocumentViewer,      
      private db : Storage,
      private router: Router) {
      this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }

      plt.ready().then((source) => {
        console.log("platform: " + source);
      });

      //this.db.set('Nome', 'Gilson DeLima');
      this.db.get('LSU').then((LSU) => {
        let SU = JSON.parse(atob(LSU));
        this.CodigoUsuarioSistema = SU[0].CodigoUsuario;
        this.NomeUsuarioSistema = SU[0].Nome;        
      });

    });
  }

  ngOnInit() {
 
  }
  /*
  onCopy(text) {
    this.clipboard.copy(text);
  }
  */

}
