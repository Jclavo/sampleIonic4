import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; 

//MODELS
import { EmployeeModel } from '../../models/employee.model';

//SERVICE
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  static CRUD_PESQUISAR: string =  'Pesquisar';
  static CRUD_APAGAR: string =  'Apagar';


  private employee = new EmployeeModel();
  private employees: Array<EmployeeModel> = [];

  constructor(private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private alertController: AlertController) {} 

  ngOnInit() {
    this.CRUDEmployee(HomePage.CRUD_PESQUISAR,null);
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
    this.employee.employee_id = employee_id;
    this.CRUDEmployee(HomePage.CRUD_APAGAR,null);
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

    this.employee.employee_id = null

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
          }else
          {
            this.employees  = [];
          }
          
          if(StatusCRUD == HomePage.CRUD_APAGAR)
          {
            this.CRUDEmployee(HomePage.CRUD_PESQUISAR,null);
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

  async willDeleteEmployee(employee_id: string) {

    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>Deleted?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          // handler: (blah) => {
          //   console.log('Confirm Cancel: blah');
          // }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteEmployee(employee_id);
          }
        }
      ]
    });

    await alert.present();
  }

}
