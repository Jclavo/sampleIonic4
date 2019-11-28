import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_HOST   = "http://200.196.251.212"; 
  //API_HOST = "http://192.168.0.121";

  API_URL = "/ServiceExample/api/example";
  APP_NAME = "Cadastro Imobiliário";

  API = "/ServiceExample/"
  API_NAME = this.API_HOST + this.API;


  IMAGE_CROQUI_PATH = "uploads/imagems/croqui/";

  constructor() { }
}