import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
//import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { environment } from "../../../environments/environment.prod"
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { AuthService } from 'src/app/services/auth.service';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
// for install: https://www.npmjs.com/package/ts-md5
import { Md5 } from 'ts-md5/dist/md5';
import { Router } from '@angular/router';
//import { Network } from '@ionic-native/network'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  @ViewChild('email', { static: false }) iemail;
  public CodigoUsuarioSistema: string;
  public NomeUsuarioSistema: String;

  constructor(
    private platform: Platform
    , private modalController: ModalController
    , private navCtrl: NavController
    , private alertService: AlertService
    , private env: EnvService
    , private Authorizer: AuthService
    , private db: Storage
    , private router: Router
  ) {
    // LSU -> LAST SESSION USER
    this.db.get('LSU').then((LSU) => {
      let SU = JSON.parse(atob(LSU));
      this.CodigoUsuarioSistema = SU[0].CodigoUsuario;
      this.NomeUsuarioSistema = SU[0].Nome;
      console.log('Olá, ' + SU[0].Nome + '! Você foi a última pessoa a entrar no sistema nesse dispositivo.');
    });

  }
  /*
  checkConnection() {
    let networkState = "";//navigator.connection.type;

    let states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
  }
  */

  ngOnInit() {
    //this.checkConnection();

    // Uso a instrução (fetch) para pegar o ip do roteador.
    let ipAPI: any = 'https://api.ipify.org?format=json'
    fetch(ipAPI).then(response => response.json()).then(data => sessionStorage.setItem('SessionIP', data.ip)).catch(() => { }
    )
    // Este método retorna ON/OFF do Serviço onde esta API.
    //this.Authorizer.EngineStatusConection(this.env.API_HOST);  

    // Teste de recuperação de dados

    // Zero a SessionConection 

  }

  ionViewWillEnter() {
    // Disparado quando o roteamento de componentes está prestes a se animar.    
    //console.log("ionViewWillEnter");    
  }


  ionViewDidEnter() {
    // Disparado quando o roteamento de componentes terminou de ser animado.        
    // console.log("ionViewDidEnter");     
    setTimeout(() => {
      this.iemail.setFocus();
    }, 150);

  }

  ionViewWillLeave() {
    // Disparado quando o roteamento de componentes está prestes a ser animado.    
    //console.log("ionViewWillLeave");
  }

  ionViewDidLeave() {
    // Disparado quando o roteamento de componentes terminou de ser animado.    
    //console.log("ionViewDidLeave");

  }

  backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      console.log('exit');
      navigator['app'].exitApp();
    })
  }

  AuthLogin(form: NgForm) {
    //this.alertService.showLoader('Carregando... aguarde!!!');
    //this.alertService.presentAlert({pTitle:'e-Cupom33',pSubtitle:'Teste',pMessage:'TESTANDO DIALOG'} );
    //this.alertService.presentAlertConfirm({pTitleConfirm: 'e-Cupom33', pMessage:'Confirmar procedimento?',pTextBtnCancel:'Não',pTextOkay:'Sim' });
    //this.alertService.presentToast("Mensagem Toast: Logando...");

    //let pwd : any = Md5cla.hashStr(form.value.password);
    form.value.password = Md5.hashStr(form.value.password);

    // this.Authorizer.Login(form).then( res => {        
    //   //console.log("Resultado Json:", res);
    //   let resultado: any = res[0];
    //   if (resultado.success == true) { 
    //     this.alertService.showLoader(resultado.message, 2000); 
    //     //this.navCtrl.navigateRoot('/menu/options'); 
    //     this.navCtrl.navigateRoot('/main'); 
    //     //this.alertService.presentToast(resultado.message);

    //   }      
    // });

    // let params = {
    //   'CodigoUsuarioSistema': this.Authorizer.CodigoUsuarioSistema, 
    //   'Hashkey'             : this.Authorizer.HashKey      
    // };

    //this.Authorizer.QueryStoreProc('Executar', 'spUsuarioAuthentication', form.value).then( res => {        
    this.Authorizer.Login(form).then(res => {
      //console.log("Resultado Json:", res);
      let resultado: any = res[0];
      if (resultado.success == true) {
        this.alertService.showLoader(resultado.message, 2000);
        //this.navCtrl.navigateRoot('/menu/options'); 
        // this.navCtrl.navigateRoot('/menu/options'); 
        this.router.navigate(['/menu/options']);
        //this.alertService.presentToast(resultado.message);

      }
    });

  }

  handleLogin() {
    // Do your stuff here
    console.log('Button enter device');
  }

}