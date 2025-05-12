import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeesService } from '../../../services/employees.services';

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

  employee_data: any = []

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeesService,
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeData();
    // this.initializeForms();
  }

  initializeForms() {
    this.employeeForm = this.fb.group({
      employee_name: [this.employee_data.employee_name],
      employee_lastname: [this.employee_data.employee_lastname],
      employee_phone_number: [this.employee_data.employee_phone_number],
      employee_email: [this.employee_data.employee_email],
      employee_address: [ this.employee_data.employee_address],
      employee_national_id: [this.employee_data.employee_national_id],
      employee_gender: [this.employee_data.employee_gender],
      employee_birth_date: [this.employee_data.employee_birth_date],
      employee_job_title: [this.employee_data.employee_job_title],
      employee_matricule: [this.employee_data.employee_matricule],
      employee_joining_date: [this.employee_data.employee_joining_date],
    });

    this.contactForm = this.fb.group({
      contract_type_id: [ this.employee_data.contract_type_id],
      salary: [this.employee_data.salary],
    });

    this.bankDetailsForm = this.fb.group({
      account_holder_name: [this.employee_data.account_holder_name],
      account_number: [this.employee_data.account_number],
      bank_name: [this.employee_data.bank_name],
      branch_location: [this.employee_data.branch_location],
      tax_payer_id: [this.employee_data.tax_payer_id],
    });
  }

  fetchEmployeeData() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    console.log(" the id ======>  ", employeeId);
    
    this.isLoading = true;

    this.employeeService.getEmployeeById(Number(employeeId)).subscribe((data: any) => {
      if(data.status){
        this.isLoading = false
        console.log(" employee data ======> ", data);
        this.employee_data = data.data;
        this.initializeForms();
      }
    })
  }

  UpdateEmployee() {
    const updatedEmployee = {
      ...this.employeeForm.value,
      ...this.contactForm.value,
      ...this.bankDetailsForm.value
    };

    console.log('Updated employee:', updatedEmployee);

    //
  }

  onCancel() {
    this.router.navigate(['/main-page/hr/employees-list']);
  }
}
