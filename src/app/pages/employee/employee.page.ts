import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; 

//MODELS
import { EmployeeModel } from '../../models/employee.model';
import { CountryModel } from '../../models/country.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  private employee = new EmployeeModel();
  private employees: Array<EmployeeModel> = [];

  private countries: Array<CountryModel> = [];

  constructor() { }

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
  }

}
