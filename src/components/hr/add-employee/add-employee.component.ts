import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmployeesService } from '../../../services/employees.services';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-add-employee',
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatOptionModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  contactForm: FormGroup;
  bankDetailsForm: FormGroup;
  isLoading: boolean = false;
  contract_types_data: any = [];
  jobs_data: any = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      employee_name: ['', Validators.required],
      employee_lastname: ['', Validators.required],
      employee_phone_number: ['', Validators.required],
      employee_email: ['', [Validators.required, Validators.email]],
      employee_address: [''],
      employee_national_id: ['', Validators.required],
      employee_gender: [''],
      employee_birth_date: [''],
      employee_job_title: [''],
      employee_matricule: [''],
      employee_joining_date: [null],
      employee_end_date: [null],
    });

    this.contactForm = this.fb.group({
      contract_type_id: ['', Validators.required],
      salary: [''],
    });

    this.bankDetailsForm = this.fb.group({
      account_holder_name: ['', Validators.required],
      account_number: ['', Validators.required],
      bank_name: ['', Validators.required],
      branch_location: ['', Validators.required],
      tax_payer_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.employeeService.getJobsAndContractTypes().subscribe((data: any) => {
      this.contract_types_data = data.data_contract_types;
      this.jobs_data = data.data_jobs;
    });
  }

  onSubmitAll() {
    if (
      this.employeeForm.valid &&
      this.contactForm.valid &&
      this.bankDetailsForm.valid
    ) {
      const payload = {
        ...this.employeeForm.value,
        ...this.contactForm.value,
        ...this.bankDetailsForm.value,
      };
      this.employeeService.addOneEmployee(payload).subscribe((data: any) => {
        this.isLoading = true;
        if (data.success) {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: "L'employé est ajouté avec succès",
          }).then(() => {
            this.employeeForm.reset();
            this.contactForm.reset();
            this.bankDetailsForm.reset();
            this.router.navigate(['/main-page/hr/employees-list']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "L'employé n'est pas ajouté",
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez remplir tous les champs obligatoires',
      }).then(() => {
        this.employeeForm.markAllAsTouched();
        this.contactForm.markAllAsTouched();
        this.bankDetailsForm.markAllAsTouched();
      });
    }
  }
}
