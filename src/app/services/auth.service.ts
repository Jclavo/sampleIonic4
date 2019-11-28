import { Injectable } from '@angular/core';
import { Platform, NavController } from '@ionic/angular'
//import { Network }      from '@ionic-native/network';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from './env.service';
//import { tap }          from 'rxjs/operators';
//import { User }         from '../models/user';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
//import { Base64 } from '@ionic-native/base64/ngx';
//import { Observable, throwError } from 'rxjs';
// import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';



@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private headers = new Headers();
  isLoggedIn = false;
  coletionsData: any;
  CodigoUsuarioSistema: String;
  NomeUsuarioSistema: String;
  HashKey: String;
  constructor(
    private http: HttpClient,
    private platform: Platform,
    //private network: Network,      
    private env: EnvService,
    private alertService: AlertService,
    //private base64: Base64   
    private db: Storage,
    private location: Location,
    private envService: EnvService
  ) {
    this.headers.append('Content-Type', 'application/json');
  }

  /*
  CheckConnectivity() {
    this.platform.ready().then(() => {
      // if no internet, notice is a string
      if (this.network.type == 'none' ) {         
        this.alertService.presentAlert({
          pTitle:'ATENÇÃO',
          pSubtitle:'Autendicação no Sistema',
          pMessage:'Não existe conexão de dados no momento. Tente novamente'
        });
      } else {
          return false;
      }
    })
  }
  */
  // função para verificar conexão de Host Engine API
  EngineStatusConection = function (host: string) {
    var started = new Date().getTime();
    var url = host
    fetch(url).then(response => {
      if (response.status === 200) {
        return response.statusText;
      } else {
        throw new Error('Algo deu errado no servidor da EngineAPI!');
      }
    }
    ).then(response => {
      console.debug(response);
      sessionStorage.setItem('EngineStatusConection', "ON");
      return true;
    }
    ).catch(error => {
      //console.error(error);
      sessionStorage.setItem('EngineStatusConection', 'OFF');
      return false;
    }
    );
  }

  Login = async function (form: NgForm) {
    //--------------------------------------------------------------------------------------------    
    // Função Login 
    // Criação / Atualização: 24/07/2019 as 15:35          
    // Por Gilson DeLima    
    //--------------------------------------------------------------------------------------------
    //this.alertService.showLoader("Processando... Aguarde por favor!!!");    
    let json: string = JSON.stringify(form.value);
    json = this.encripta(json);
    let ParamDataJson = btoa(json); // encode string  
    let strDataJson = atob(ParamDataJson);                // decode string
    let StoreProcName = "spUsuarioAuthentication"

    const paramUrlAPI = this.env.API_HOST + this.env.API_URL + '/authentication?';
    const paramsAPI = "StoreProcName=" + StoreProcName + "&DataJson=" + ParamDataJson; //+ "&Hashkey="+ParamHashkey;

    const EngineAPI = paramUrlAPI + paramsAPI
    console.log(EngineAPI);
    return new Promise((resolve, reject) => {
      this.coletionsData = this.http.get(EngineAPI);
      this.coletionsData.subscribe(
        data => {
          if (data[0].success) {
            //sessionStorage.setItem('SessionUser', JSON.stringify(data[0].results));
            this.db.set('LSU', btoa(data[0].results));
            this.db.set('HKEY', btoa(data[0].hashkey));

            this.CodigoUsuarioSistema = JSON.parse(data[0].results)[0].CodigoUsuario;
            this.NomeUsuarioSistema = JSON.parse(data[0].results)[0].Nome;
            this.HashKey = data[0].hashkey;
          }
          else {
            sessionStorage.setItem("SessionConection", "0");
            this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: 'Autenticação do Sistema', pMessage: data[0].message });
          }
          resolve(data);
        },
        (error: any) => {
          this.alertService.presentAlert({ pTitle: "Atenção", pSubtitle: "Servidor Indisponível. Tente mais tarde!!!", pMessage: "Status Error:" + error.status + " | " + error.statusText });
          console.log("Error: ", error);
        }
      );
    });
  }

  Register = async function (form: NgForm) {
    //--------------------------------------------------------------------------------------------    
    // Função Login 
    // Criação / Atualização: 29/07/2019 as 10:42          
    // Por Gilson DeLima    
    //--------------------------------------------------------------------------------------------
    //this.alertService.showLoader("Processando... Aguarde por favor!!!");        
    let StoreProcName = "spRegister";
    let ParamDataJson = btoa(JSON.stringify(form.value)); // encode string  
    let strDataJson = atob(ParamDataJson);                // decode string
    //console.log(strDataJson);              

    const paramUrlAPI = this.env.API_HOST + this.env.API_URL + '/register?';
    const paramsAPI = "StoreProcName=" + StoreProcName + "&DataJson=" + ParamDataJson;

    const EngineAPI = paramUrlAPI + paramsAPI
    return new Promise(resolve => {
      this.coletionsData = this.http.get(EngineAPI);
      this.coletionsData.subscribe(data => {
        resolve(data);
        //console.log(data);                              
      },
        (error: any) => {
          this.alertService.presentAlert({ pTitle: "Atenção", pSubtitle: "Servidor Indisponível. Tente mais tarde!!!", pMessage: "Status Error:" + error.status + " | " + error.statusText });
          console.log("Error: ", error);
        }
      );
    })

  }

  QueryStoreProc = async function (MetodoNameAPI: String, StoreProcName: String, ParamsJson: any) {
    //--------------------------------------------------------------------------------------------    
    // Função Gerenerica de consulta no Service API  
    // Criação / Atualização: 29/07/2019 as 10:42          
    // Por Gilson DeLima    
    //--------------------------------------------------------------------------------------------
    // Params: opcao = ex: ConsultaGrupos, consultaJson = ex: paramsGrupo
    //--------------------------------------------------------------------------------------------
    //this.alertService.showLoader("Processando... Aguarde por favor!!!"); 
    let json: string = JSON.stringify(ParamsJson);
    json = this.encripta(json);
    let ParamDataJson = btoa(json); // encode string 
    //let strDataJson = atob(ParamDataJson);                // decode string
    //console.log(strDataJson);              
    //ConsultaMenu
    const paramUrlAPI = this.env.API_HOST + this.env.API_URL + '/' + MetodoNameAPI + '?';
    const paramsAPI = "StoreProcName=" + StoreProcName + "&DataJson=" + ParamDataJson;

    const EngineAPI = paramUrlAPI + paramsAPI;
    //console.log(EngineAPI);
    return new Promise(resolve => {
      this.coletionsData = this.http.get(EngineAPI);

      this.coletionsData.subscribe(
        data => {
          resolve(data);
        },
        (error: any) => {
          this.alertService.presentAlert({ pTitle: "Atenção", pSubtitle: "Servidor ou Método Indisponível. Tente mais tarde!!!", pMessage: "Status Error:" + error.status + " | " + error.statusText });
          console.log("Error: ", error);
        }
      );
    });
  }

  QueryStoreImagem = async function (MetodoNameAPI: String, nomeImagem: string, rutaSalvar: string, imagem: any) {
    //--------------------------------------------------------------------------------------------    
    // Função para salvar IMAGE  
    // Criação / Atualização: 29/07/2019 as 10:42          
    // Por JClavo    
    //--------------------------------------------------------------------------------------------

    const paramUrlAPI = this.env.API_HOST + this.env.API_URL + '/' + MetodoNameAPI;

    const formImagem = new FormData();
    formImagem.append('nome', nomeImagem);
    formImagem.append('ruta', rutaSalvar);
    formImagem.append('imagem', imagem, imagem.name);

    return new Promise(resolve => {
      this.coletionsData = this.http.post(paramUrlAPI, formImagem);

      this.coletionsData.subscribe(
        data => {
          resolve(data);
        },
        (error: any) => {
          this.alertService.presentAlert({ pTitle: "Atenção", pSubtitle: "Servidor ou Método Indisponível. Tente mais tarde!!!", pMessage: "Status Error:" + error.status + " | " + error.statusText });
          console.log("Error: ", error);
        }
      );
    });
  }

  // async salvarImagem(nome: string, ruta: string, imagem: any) {
  //   let rutaImagem: string;

  //   const formData = new FormData();
  //   formData.append('nome', nome);
  //   formData.append('ruta', ruta);
  //   formData.append('imagem', imagem, imagem.name);

  //   return new Promise(resolve => {

  //     this.QueryStoreImagem('SalvarImagem', 'spCRUDcroqui', formData).then(res => {
  //       let resultado: any = res[0];
  //       //resultado.results // This is the complete path. Ejemplo: "C:\web\sites\ServiceImobiliario\uploads\imagems\croqui\y35swmarzjt.jpg"
  //       if (resultado) {
  //         // let imgResult = this.imgResult.nativeElement as HTMLInputElement;
  //         // imgResult.src = res[0].results;

  //         rutaImagem = this.envService.API_NAME + resultado.results;

  //         //return new Promise(resolve => {
  //         resolve(rutaImagem);
  //         //})

  //       } else {
  //         this.alertService.showLoader(res[0].message, 2000);
  //         // return new Promise(resolve => {
  //         resolve(rutaImagem);
  //         //})       
  //       }
  //     });

  //   })
  // }

  voltar() {
    this.location.back();
  }

  private encripta(valor: string): string {
    let retorno: string;
    let stexto: string;
    retorno = "";
    try {
      stexto = valor.trim();
    } catch (err) {
      stexto = valor;
    }
    if (stexto == null)
      stexto = "";
    if (stexto == "")
      return stexto;
    while (true) {
      let letra: string;
      let nnumero: number;
      let snumero: string;
      if (stexto.length > 1)
        letra = stexto.substring(0, 1);
      else
        letra = stexto;

      nnumero = letra.toString().charCodeAt(0);
      nnumero += 166;
      snumero = nnumero.toString();
      if (snumero.length < 3)
        snumero = "0" + snumero;
      if (snumero.length < 3)
        snumero = "0" + snumero;

      retorno += snumero;
      if (stexto.length > 1)
        stexto = stexto.substring(1);
      else
        stexto = "";
      if (stexto == "")
        break;
    }
    return retorno;
  }

  CarragaImagenAPI = async function (FileName: String, StoreProcName: string) {
    //--------------------------------------------------------------------------------------------    
    // Função Carrega ImagemAPI
    // Criação / Atualização: 27/10/2019 as 13:00          
    // Por Gilson DeLima    
    //--------------------------------------------------------------------------------------------    
    let params = {
      'CodigoUsuarioSistema': this.CodigoUsuarioSistema,
      'Hashkey': this.HashKey,
      'FileName': FileName
    };
    let ParamDataJson = btoa(JSON.stringify(params));

    const paramUrlAPI = this.API_HOST + this.API_URL + '/LoadImageApi?';
    const paramsAPI = "StoreProcName=" + StoreProcName + "&DataJson=" + ParamDataJson;
    const EngineAPI = paramUrlAPI + paramsAPI

    return new Promise(resolve => {
      this.coletionsData = this.http.get(EngineAPI);
      this.coletionsData.subscribe(
        data => {
          data[0].results = 'data:image/jpeg;base64,' + atob(data[0].results);
          resolve(data);
          ////console.log((data);                              
        },
        (error: any) => {
          this.alertService.presentAlert({ pTitle: "Atenção", pSubtitle: "Servidor Indisponível. Tente mais tarde!!!", pMessage: "Status Error:" + error.status + " | " + error.statusText });
          //console.log(("Error: ", error);
        }
      );
    })
  }

}

