import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { EmployeesService } from '../../../services/employees.services';
import Swal from 'sweetalert2';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  isLoading: boolean = false;

  limit: number = 20;
  offset: number = 0;
  keyword = new FormControl('');

  employeeList: any[] = [];
  total_employees_count: number = 0;
  male_employees_count: number = 0;
  female_employees_count: number = 0;
  new_employees_count: number = 0;

  constructor(private employeeServicee: EmployeesService, private router: Router) {}

  ngOnInit(): void {
    this.getAllEmployeesFunction(this.limit, this.offset, this.keyword.value ?? '');

    this.keyword.valueChanges.pipe(debounceTime(500),distinctUntilChanged()).subscribe((value: string | null) => {
      this.offset = 0;
      this.getAllEmployeesFunction(this.limit, this.offset, (value ?? '').trim());
    });
  }

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

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getAllEmployeesFunction(this.limit, this.offset, this.keyword.value ?? '');
  }

  onEditEmployee(employeeId: number) {
    this.router.navigate(['/main-page/hr/edit-employee', employeeId]);
  }

onSearch() {
  this.offset = 0;
  this.getAllEmployeesFunction(this.limit, this.offset, this.keyword.value ?? '');
}

clearSearch() {
  this.keyword.setValue('');
  this.offset = 0;
  this.getAllEmployeesFunction(this.limit, this.offset, '');
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
              this.getAllEmployeesFunction(this.limit, this.offset, this.keyword.value ?? '');
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