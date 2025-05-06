import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { getAllEmployees } from '../../../store/employees/employees.actions';
import { selectAllEmployees, selectEmployeesLoading } from '../../../store/employees/employees.selectors';


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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectEmployeesLoading);
    const DATA =  this.store.dispatch(getAllEmployees());
    console.log("data ? -------> ");
     
  }
}
