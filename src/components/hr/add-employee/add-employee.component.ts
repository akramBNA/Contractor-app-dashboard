import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmployeesService } from '../../../services/employees.services';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-add-employee',
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  contactForm: FormGroup;
  bankDetailsForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService
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
      employee_joining_date: [''],
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
      console.log('All Forms Data:', payload);
      this.employeeService.addOneEmployee(payload).subscribe((data: any) => {
        this.isLoading = true;
        if (data.status) {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: "L'employé est ajouté avec succès",
          });
          this.employeeForm.reset();
          this.contactForm.reset();
          this.bankDetailsForm.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "L'employé n'est pas ajouté",
          });
        }
      });
    } else {
      this.employeeForm.markAllAsTouched();
      this.contactForm.markAllAsTouched();
      this.bankDetailsForm.markAllAsTouched();
    }
  }
}
