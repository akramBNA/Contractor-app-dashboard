import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Store } from '@ngrx/store';
// import { getAllEmployees } from '../../../store/employees/employees.actions';
// import {
//   selectAllEmployees,
//   selectEmployeesLoading,
// } from '../../../store/employees/employees.selectors';
import { EmployeesService } from '../../../services/employees.services';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule],
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees$: any;
  loading$: any;
  DATA: any = [];

  constructor(
    // private store: Store,
  private employeeServicee: EmployeesService) {}

  ngOnInit(): void {    
    // this.store.dispatch(getAllEmployees( 20, 0, ''));
    // this.store.select(selectAllEmployees).subscribe((data: any) => {
    //   console.log('data =====> ', data);
    // });
    console.log("service =====> ", this.employeeServicee.getAllEmployees);
    
    this.employeeServicee.getAllEmployees(20, 0, '').subscribe((data: any) => {
      console.log('data =====> ', data)
    })
  }
}
