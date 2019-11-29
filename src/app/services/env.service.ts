import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  //SERVER
  API_HOST   = "http://200.196.251.212"; 

  // LOCALHOST
  //API_HOST = "http://192.168.15.4"; 

  // URL FROM IIS as Example
  API_URL = "/ServiceExample/api/sampleIonic4";

  APP_NAME = "Sample Ionic 4";

  // Variables to work with Images
  API = "/ServiceExample/"
  API_NAME = this.API_HOST + this.API;
  IMAGE_CROQUI_PATH = "uploads/imagems/croqui/";

  constructor() { }
}