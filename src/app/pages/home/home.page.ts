import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; 

//MODELS
import { EmployeeModel } from '../../models/employee.model';

//SERVICE
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private employees: Array<EmployeeModel> = [];

  constructor(private router: Router,
    private alertService: AlertService,
    private authService: AuthService) {} 

  ngOnInit() {

  }

  createEmployee()
  {
    // this.router.navigate(['/menu/options/tabs/inscricao-cadastral', this.CodigoTipoBoletim]);
    this.router.navigate(['employee']);
  }

  updateEmployee(employee_id: string)
  {
    this.router.navigate(['employee',employee_id]);
  }

  deleteEmployee(employee_id: string)
  {
    //this.CRUDEmployee("", "formEmployee");
  }



  CRUDEmployee(StatusCRUD: string, formEmployee: NgForm)
  {
    let params = {
      'CodigoUsuarioSistema': this.authService.CodigoUsuarioSistema,
      'StatusCRUD': StatusCRUD,
      'formValues': (formEmployee) ? formEmployee.value : ""

    };

    // API methode's name
    // Store Procedure's name
    // parameters

    this.authService.QueryStoreProc('Executar', 'spCRUDEmployee', params).then(res => {
      let resultado: any = res[0];
      try {
        if (resultado.success) {
          console.log(resultado.message);
          if (resultado.results) 
          {
            this.employees  = JSON.parse(resultado.results);
            // this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            // this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            // this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            // this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            // this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            // this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            
          } 
        }
        else {
          this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: "this.AppName", pMessage: resultado.message });
          //this.router.navigate(['/home']);
        }
      } catch (err) {
        this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: "this.AppName", pMessage: resultado.message });
        //this.router.navigate(['/home']);
      }
    });
  }

}
