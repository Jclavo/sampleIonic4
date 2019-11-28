import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; 

//MODELS
import { EmployeeModel } from '../../models/employee.model';
import { CountryModel } from '../../models/country.model';

//SERVICE
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  private employee = new EmployeeModel();
  private employees: Array<EmployeeModel> = [];

  private countries: Array<CountryModel> = [];

  constructor(private alertService: AlertService,
    private authService: AuthService) { }

  ngOnInit() {
    this.mockCountries();
  }

  mockCountries()
  {
    this.countries.push({'country_id': "1",'name': "Peru" });
    this.countries.push({'country_id': "2",'name': "Colombia" });
    this.countries.push({'country_id': "3",'name': "Brazil" });
    this.countries.push({'country_id': "4",'name': "India" });
    this.countries.push({'country_id': "5",'name': "Tunisia" });
  }

  save(formEmployee: NgForm)
  {
    console.log('formEmployee: ',formEmployee.value);
    if(this.employee.employee_id)
    {
      this.CRUDEmployee('',formEmployee);
    }
    else
    {
      this.CRUDEmployee('',formEmployee);
    }
    
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
            this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            
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
