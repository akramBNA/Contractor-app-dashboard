import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { EmployeesService } from '../../../services/employees.services';

// import { getAllEmployees } from '../../../store/employees/employees.actions';
// import {
//   selectAllEmployees,
//   selectEmployeesLoading,
// } from '../../../store/employees/employees.selectors';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule, MatButtonModule],
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  limit: number = 20;
  offset: number = 0;
  keyword: string = '';

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
    private employeeServicee: EmployeesService,
    private router: Router,
  ) {}
  getAllEmployeesFunction(lim: number, off: number, key: string) {
    this.employeeServicee.getAllEmployees(lim, off, key).subscribe((data: any) => {
        console.log('data =====> ', data);
        this.employeeList = data.data;
        this.total_employees_count = data.statistics.total;
        this.male_employees_count = data.statistics.male;
        this.female_employees_count = data.statistics.female;
        this.new_employees_count = data.statistics.newEmployees;
      });
  }

  ngOnInit(): void {
    // this.store.dispatch(getAllEmployees( 20, 0, ''));
    // this.store.select(selectAllEmployees).subscribe((data: any) => {
    //   console.log('data =====> ', data);
    // });

    /*this.employeeServicee.getAllEmployees(this.limit, this.offset, this.keyword).subscribe((data: any) => {
      console.log('data =====> ', data);
      this.employeeList = data.data;
      this.total_employees_count = data.statistics.total;
      this.male_employees_count = data.statistics.male;
      this.female_employees_count = data.statistics.female;
      this.new_employees_count = data.statistics.newEmployees;
    }); */

    this.getAllEmployeesFunction(this.limit, this.offset, this.keyword);
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.employeeList.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.employeeList.length / this.pageSize);
  }

  setPageSize(size: number) {
    // this.pageSize = size;
    // this.currentPage = 1;
    this.getAllEmployeesFunction(size, this.offset, this.keyword);
  }

  onEditEmployee(employeeId: number) {
    // Navigate to your edit route with the employee ID
    console.log('Editing employee with ID:', employeeId);
    // TODO: Replace with actual route once ready
    this.router.navigate(['/main-page/hr/edit-employee', employeeId]);
  }

  onDeleteEmployee(employeeId: number) {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer cet employé ?'
    );
    if (confirmed) {
      // this.employeeServicee.deleteEmployee(employeeId).subscribe(() => {
      //   // Refresh the list after deletion
      //   this.getAllEmployeesFunction(this.limit, this.offset, this.keyword);
      // });
    }
  }
}
