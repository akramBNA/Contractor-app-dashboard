import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeesService } from '../../../services/employees.services';
import { ContractTypesService } from '../../../services/contract_types.services'


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
    private contractTypesService: ContractTypesService

  ) {}

  ngOnInit(): void {
    this.contractTypesService.getAllContractTypes().subscribe((data: any) => {
    this.contract_types_data = data.data;
    })
    this.fetchEmployeeData();
    this.initializeForms();
  }

  initializeForms() {
    this.employeeForm = this.fb.group({
      employee_name: [''],
      employee_lastname: [''],
      employee_phone_number: [''],
      employee_email: [''],
      employee_address: [ ''],
      employee_national_id: [''],
      employee_gender: [''],
      employee_birth_date: [''],
      employee_job_title: [],
      employee_matricule: [''],
      employee_joining_date: [''],
    });

    this.contactForm = this.fb.group({
      contract_type_id: [ ''],
      salary: [''],
    });

    this.bankDetailsForm = this.fb.group({
      account_holder_name: [''],
      account_number: [''],
      bank_name: [''],
      branch_location: [''],
      tax_payer_id: [''],
    });
  }

  initializeFormsWithData(data: any) {
    this.employeeForm = this.fb.group({
      employee_name: [data.employee_name || ''],
      employee_lastname: [data.employee_lastname || ''],
      employee_phone_number: [data.employee_phone_number || ''],
      employee_email: [data.employee_email || ''],
      employee_address: [ data.employee_address || ''],
      employee_national_id: [data.employee_national_id || ''],
      employee_gender: [data.employee_gender || ''],
      employee_birth_date: [data.employee_birth_date || ''],
      employee_job_title: [data.employee_job_title || ''],
      employee_matricule: [data.employee_matricule || ''],
      employee_joining_date: [data.employee_joining_date || ''],
    });

    this.contactForm = this.fb.group({
      contract_type_id: [ data.contract_type_id || ''],
      salary: [data.salary || ''],
    });

    this.bankDetailsForm = this.fb.group({
      account_holder_name: [data.account_holder_name || ''],
      account_number: [data.account_number || ''],
      bank_name: [data.bank_name || ''],
      branch_location: [data.branch_location || ''],
      tax_payer_id: [data.tax_payer_id || ''],
    });
  }

  fetchEmployeeData() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;

    this.employeeService.getEmployeeById(Number(employeeId)).subscribe((data: any) => {
      if(data.status){
        this.isLoading = false
        this.employee_data = data.data;
        this.initializeFormsWithData(this.employee_data);
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

    // to be continued...
  }

  onCancel() {
    this.router.navigate(['/main-page/hr/employees-list']);
  }
}
