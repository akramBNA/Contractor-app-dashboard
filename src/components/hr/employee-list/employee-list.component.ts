import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { getAllEmployees } from '../../../store/employees/employees.actions';
import {
  selectAllEmployees,
  selectEmployeesLoading,
} from '../../../store/employees/employees.selectors';

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
    console.log("tet");
    
    this.store.dispatch(getAllEmployees());
    this.store.select(selectAllEmployees).subscribe((data: any) => {
      console.log('data =====> ', data);
    });
  }
}
