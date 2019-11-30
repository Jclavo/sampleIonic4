import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';

//MODELS
import { EmployeeModel } from '../../models/employee.model';

//SERVICE
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { EnvService } from '../../services/env.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {

  static CRUD_PESQUISAR: string = 'Pesquisar';
  static CRUD_APAGAR: string = 'Apagar';
  static APP_NAME: string = EnvService.name;

  private employee = new EmployeeModel();
  private employees: Array<EmployeeModel> = [];

  constructor(private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private alertController: AlertController) {
    //console.log('I am a constructor beach!');
  }

  // this is not working, maybe because is HomePage
  ngOnInit() {
  }

  // Instead I have to use it
  ionViewDidEnter() {
    this.CRUDEmployee(EmployeeListPage.CRUD_PESQUISAR, null);
  }

  createEmployee() {
    // this.router.navigate(['/menu/options/tabs/inscricao-cadastral', this.CodigoTipoBoletim]);
    this.router.navigate(['/menu/options/tabs/employee']);
  }

  updateEmployee(employee_id: string) {
    this.router.navigate(['/menu/options/tabs/employee', employee_id]);
  }

  deleteEmployee(employee_id: string) {
    this.employee.employee_id = employee_id;
    this.CRUDEmployee(EmployeeListPage.CRUD_APAGAR, null);
  }


  CRUDEmployee(StatusCRUD: string, formEmployee: NgForm) {
    let params = {
      'CodigoUsuarioSistema': this.authService.CodigoUsuarioSistema,
      //'CodigoUsuarioSistema': 1,
      'Hashkey': this.authService.HashKey,
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

          if (resultado.results) {
            this.employees = JSON.parse(resultado.results);
            // this.employee.employee_id = JSON.parse(resultado.results)[0].employee_id;
          } else {
            this.employees = [];
          }

          if (StatusCRUD == EmployeeListPage.CRUD_APAGAR) {
            this.alertService.presentToast(resultado.message);
            this.CRUDEmployee(EmployeeListPage.CRUD_PESQUISAR, null);
          }
        }
        else {
          this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: EmployeeListPage.APP_NAME, pMessage: resultado.message });
          this.router.navigate(['/login']);
        }
      } catch (err) {
        this.alertService.presentAlert({ pTitle: 'ATENÇÃO', pSubtitle: EmployeeListPage.APP_NAME, pMessage: resultado.message });
        this.router.navigate(['/login']);
      }
    });
  }

  async willDeleteEmployee(employee_id: string, name: string) {

    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Deleted <strong>' + name + '?</strong>!!!',
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
