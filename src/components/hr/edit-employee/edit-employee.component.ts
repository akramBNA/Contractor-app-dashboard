import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatProgressSpinnerModule],
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  contactForm!: FormGroup;
  bankDetailsForm!: FormGroup;
  isLoading = false;
  contract_types_data: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.fetchEmployeeData();
  }

  initializeForms() {
    this.employeeForm = this.fb.group({
      employee_name: [''],
      employee_lastname: [''],
      employee_phone_number: [''],
      employee_email: [''],
      employee_address: [''],
      employee_national_id: [''],
      employee_gender: [''],
      employee_birth_date: [''],
      employee_job_title: [''],
      employee_matricule: [''],
      employee_joining_date: ['']
    });

    this.contactForm = this.fb.group({
      contract_type_id: [''],
      salary: ['']
    });

    this.bankDetailsForm = this.fb.group({
      account_holder_name: [''],
      account_number: [''],
      bank_name: [''],
      branch_location: [''],
      tax_payer_id: ['']
    });
  }

  fetchEmployeeData() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (!employeeId) return;

    this.isLoading = true;

    // TODO: Replace with API call when backend is ready
    setTimeout(() => {
      const mockEmployeeData = {
       //
      };

      this.employeeForm.patchValue(mockEmployeeData);
      this.contactForm.patchValue(mockEmployeeData);
      this.bankDetailsForm.patchValue(mockEmployeeData);
      this.isLoading = false;
    }, 1000);
  }

  UpdateEmployee() {
    const updatedEmployee = {
      ...this.employeeForm.value,
      ...this.contactForm.value,
      ...this.bankDetailsForm.value
    };

    console.log('Updated employee:', updatedEmployee);

    // TODO: Replace with actual update API call
  }

  onCancel() {
    this.router.navigate(['/main-page/hr/employees-list']);
  }
}
