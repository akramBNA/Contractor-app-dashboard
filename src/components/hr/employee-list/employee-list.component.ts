import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { EmployeesService } from '../../../services/employees.services';

// import { getAllEmployees } from '../../../store/employees/employees.actions';
// import {
//   selectAllEmployees,
//   selectEmployeesLoading,
// } from '../../../store/employees/employees.selectors';


@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees$: any;
  loading$: any;
  DATA: any = [];
  currentPage: number = 1;
  pageSize: number = 20;

  constructor(
    private store: Store,
    private employeeServicee: EmployeesService
  ) {}
  employeeList = [
    {
      employee_matricule: 'EMP001',
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_adress: '123 Main St',
      employee_email: 'john.doe@example.com',
      employee_birth_date: '1990-01-15',
    },
    {
      employee_matricule: 'EMP002',
      employee_name: 'Jane',
      employee_lastname: 'Smith',
      employee_adress: '456 Elm St',
      employee_email: 'jane.smith@example.com',
      employee_birth_date: '1985-06-22',
    },
  ];

  ngOnInit(): void {
    // this.store.dispatch(getAllEmployees( 20, 0, ''));
    // this.store.select(selectAllEmployees).subscribe((data: any) => {
    //   console.log('data =====> ', data);
    // });
    console.log('service =====> ', this.employeeServicee.getAllEmployees);

    this.employeeServicee.getAllEmployees(20, 0, '').subscribe((data: any) => {
      console.log('data =====> ', data);
    });
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.employeeList.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.employeeList.length / this.pageSize);
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }
}
