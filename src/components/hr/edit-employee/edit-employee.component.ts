import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../../../services/employees.services';
import { SwalService } from '../../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoadingSpinnerComponent, MatFormFieldModule,MatSelectModule, MatOptionModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatNativeDateModule],
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  contactForm!: FormGroup;
  bankDetailsForm!: FormGroup;
  isLoading = false;
  contract_types_data: any[] = [];
  jobs_data: any = [];

  employee_data: any = [];
  employee_id: number = 0;
form: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeesService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.employeeService.getJobsAndContractTypes().subscribe((data: any) => {
      this.contract_types_data = data.data_contract_types;
      this.jobs_data = data.data_jobs;
    });

    this.fetchEmployeeData();
    this.initializeForms();
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
      employee_job_title: [],
      employee_matricule: [''],
      employee_joining_date: [''],
      employee_end_date: ['']
    });

    this.contactForm = this.fb.group({
      contract_type_id: [''],
      salary: [''],
    });

    this.bankDetailsForm = this.fb.group({
      account_holder_name: [''],
      account_number: ['', Validators.required],
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
      employee_address: [data.employee_address || ''],
      employee_national_id: [data.employee_national_id || ''],
      employee_gender: [data.employee_gender || ''],
      employee_birth_date: [data.employee_birth_date || ''],
      employee_job_title: [data.employee_job_title || ''],
      employee_matricule: [data.employee_matricule || ''],
      employee_joining_date: [data.employee_joining_date || null],
      employee_end_date: [data.employee_end_date || null],
    });

    this.contactForm = this.fb.group({
      contract_type_id: [data.contract_type_id || ''],
      salary: [data.salary || ''],
    });

    this.bankDetailsForm = this.fb.group({
      account_holder_name: [data.account_holder_name || ''],
      account_number: [data.account_number || '', Validators.required],
      bank_name: [data.bank_name || ''],
      branch_location: [data.branch_location || ''],
      tax_payer_id: [data.tax_payer_id || ''],
    });
  }

  fetchEmployeeData() {
   this.employee_id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;

    this.employeeService.getEmployeeById(Number(this.employee_id)).subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.employee_data = data.data;
          this.initializeFormsWithData(this.employee_data);
        }
      });
  }

  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  UpdateEmployee() {    
    this.isLoading = true;
    const updatedEmployeeData = {
      ...this.employeeForm.value,
      ...this.contactForm.value,
      ...this.bankDetailsForm.value,
      employee_birth_date: this.formatDate(this.employeeForm.value.employee_birth_date),
      employee_joining_date: this.formatDate(this.employeeForm.value.employee_joining_date),
      employee_end_date: this.formatDate(this.employeeForm.value.employee_end_date),
    };
    
    if(this.employeeForm.valid && this.contactForm.valid && this.bankDetailsForm.valid) {
          this.employeeService.updateEmployee(this.employee_id, updatedEmployeeData).subscribe((data: any) => {            
        if (data.success) {
          this.isLoading = false;
          this.swalService.showSuccess('Les données de l\'employé ont été mises à jour avec succès.').then(() => {
            this.router.navigate(['/main-page/hr/employees-list']);
          });
        } else {
          this.isLoading = false;
          this.swalService.showError('Une erreur s\'est produite lors de la mise à jour des données de l\'employé.');
        }
      });
    }else{
      this.isLoading = false;
      this.swalService.showWarning('Veuillez remplir tous les champs obligatoires.').then(() => {
        this.employeeForm.markAllAsTouched();
        this.contactForm.markAllAsTouched();    
        this.bankDetailsForm.markAllAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/main-page/hr/employees-list']);
  }
}
