import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { EmployeesService } from '../../../services/employees.services';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  isLoading: boolean = false;

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
    private router: Router
  ) {}

  getAllEmployeesFunction(lim: number, off: number, key: string) {
    this.isLoading = true;
    this.employeeServicee.getAllEmployees(lim, off, key).subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.employeeList = data.data;
          this.total_employees_count = data.statistics.total;
          this.male_employees_count = data.statistics.male;
          this.female_employees_count = data.statistics.female;
          this.new_employees_count = data.statistics.newEmployees;
        }
      });
  }

  ngOnInit(): void {
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
    this.router.navigate(['/main-page/hr/edit-employee', employeeId]);
  }

  onDeleteEmployee(employeeId: number) { 
    Swal.fire({
      icon: 'warning',
      title: 'Attention !',
      text: 'Êtes-vous sûr de vouloir supprimer cet employé ?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      reverseButtons: false    
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeServicee.deleteEmployee(Number(employeeId)).subscribe((data: any) => {
            if (data.success) {
              this.isLoading = false;
              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: "L'employé a été supprimé avec succès.",
              }).then(() => {
                this.getAllEmployeesFunction(
                  this.limit,
                  this.offset,
                  this.keyword
                );
              });
            } else {
              this.isLoading = false;
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Une erreur s'est produite lors de la suppression de l'employé.",
              });
            }
          });
      }
    });
  }
}
