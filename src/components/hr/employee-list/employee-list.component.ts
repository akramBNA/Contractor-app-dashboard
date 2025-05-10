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
  currentPage: number = 1;
  pageSize: number = 20;
  employeeList: any = [];
  total_employees_count: number = 0;
  male_employees_count: number = 0;
  female_employees_count: number = 0;
  new_employees_count: number = 0;

  constructor(
    // private store: Store,
    private employeeServicee: EmployeesService
  ) {}

  ngOnInit(): void {
    // this.store.dispatch(getAllEmployees( 20, 0, ''));
    // this.store.select(selectAllEmployees).subscribe((data: any) => {
    //   console.log('data =====> ', data);
    // });

    this.employeeServicee.getAllEmployees(20, 0, '').subscribe((data: any) => {
      console.log('data =====> ', data);
      this.employeeList = data.data;
      this.total_employees_count = data.statistics.total;
      this.male_employees_count = data.statistics.male;
      this.female_employees_count = data.statistics.female;
      this.new_employees_count = data.statistics.newEmployees;
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
