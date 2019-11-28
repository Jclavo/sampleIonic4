import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {} 

  createEmployee()
  {
    // this.router.navigate(['/menu/options/tabs/inscricao-cadastral', this.CodigoTipoBoletim]);
    this.router.navigate(['employee']);
  }

}
