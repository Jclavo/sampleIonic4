import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router';

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

  static CRUD_PESQUISAR: string =  'Pesquisar';
  static CRUD_CRIAR: string =  'Criar';
  static CRUD_SALVAR: string =  'Salvar';
  
  private employee = new EmployeeModel();
  private countries: Array<CountryModel> = [];

  constructor(private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //this.mockCountries();

    // Getting data from another page
    this.activatedRoute.params.subscribe(
      data => {

        //"data" carries all the parameters
        this.employee.employee_id = data.employe_id;

        //Your logic
        this.getCountries()
        // if(this.employee.employee_id)
        // {
        //   this.getCountries()
        // }

      }
    )



  }

  mockCountries()
  {
    // this.countries.push({'country_id': "1",'name': "Peru" });
    // this.countries.push({'country_id': "2",'name': "Colombia" });
    // this.countries.push({'country_id': "3",'name': "Brazil" });
    // this.countries.push({'country_id': "4",'name': "India" });
    // this.countries.push({'country_id': "5",'name': "Tunisia" });
  }

  save(formEmployee: NgForm)
  {

    //Custom Validation, you can create a function to validate it
    if( this.isUndefined(formEmployee.value.birthdate) 
        || this.isUndefined(formEmployee.value.genre)
        || this.isUndefined(formEmployee.value.country_id)
      )
    {
      this.alertService.presentToast('Some fields are empty..');
      return;
    }


    console.log('formEmployee: ',formEmployee.value);
    if(this.employee.employee_id)
    {
      this.CRUDEmployee(EmployeePage.CRUD_SALVAR,formEmployee);
    }
    else
    {
      this.CRUDEmployee(EmployeePage.CRUD_CRIAR,formEmployee);
    }

  }

  CRUDEmployee(StatusCRUD: string, formEmployee: NgForm)
  {
    let params = {
      // 'CodigoUsuarioSistema': this.authService.CodigoUsuarioSistema,
      'CodigoUsuarioSistema': 1,
      'StatusCRUD': StatusCRUD,
      'Employee_id': (this.employee.employee_id) ? this.employee.employee_id : "",
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
          this.alertService.presentToast(resultado.message);
          if (resultado.results) 
          {
            this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
            this.employee.fullName = JSON.parse(resultado.results)[0].fullName;
            this.employee.birthdate = JSON.parse(resultado.results)[0].birthdate;
            this.employee.genre = String(JSON.parse(resultado.results)[0].genre);
            this.employee.country_id = String(JSON.parse(resultado.results)[0].country_id);
          }
          if (StatusCRUD != EmployeePage.CRUD_PESQUISAR) this.router.navigate(['/menu/options/tabs/employee-list']);
          
        }
        else {
          this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: "this.AppName", pMessage: resultado.message });
          //this.router.navigate(['/home']);
        }
      } catch (err) {
        this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: "this.AppName", pMessage: resultado.message });
        this.router.navigate(['/login']);
      }
    });
  }

  cancel()
  {
    this.router.navigate(['/menu/options/tabs/employee-list']);
  }

  getCountries()
  {
    this.CRUDCrountry(EmployeePage.CRUD_PESQUISAR, null)
  }

  CRUDCrountry(StatusCRUD: string, formEmployee: NgForm)
  {
    let params = {
      // 'CodigoUsuarioSistema': this.authService.CodigoUsuarioSistema,
      'CodigoUsuarioSistema': 1,
      'StatusCRUD': StatusCRUD,
      //'Country_id': (this.country.country_id) ? this.country.country_id : "",
      'formValues': (formEmployee) ? formEmployee.value : ""

    };

    // API methode's name
    // Store Procedure's name
    // parameters

    this.authService.QueryStoreProc('Executar', 'spCRUDCountry', params).then(res => {
      let resultado: any = res[0];
      try {
        if (resultado.success) {
          console.log(resultado.message);
          if (resultado.results) 
          {
            this.countries = JSON.parse(resultado.results);

            this.employee.employee_id ? this.CRUDEmployee(EmployeePage.CRUD_PESQUISAR,null) : null;

          }
          else
          {
            this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: "this.AppName", pMessage: resultado.message });
          }
          
        }
        else {
          this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: "this.AppName", pMessage: resultado.message });
          //this.router.navigate(['/home']);
        }
      } catch (err) {
        this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: "this.AppName", pMessage: resultado.message });
        this.router.navigate(['/login']);
      }
    });
  }


  /*
    VALIDATION FUNCTION
    This one should be stored in an isolated file
  */

  isUndefined(value: string)
  {
    if (value == undefined) return true;
    else return false;
  }

}
