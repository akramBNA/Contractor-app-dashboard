import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { CompanyService } from '../../../services/company.services';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css'],
  imports: [CommonModule, MatInputModule, MatSelectModule, ReactiveFormsModule, LoadingSpinnerComponent]
})
export class CompanySettingsComponent implements OnInit {
  companyForm!: FormGroup;
  formSubmitted = false;
  isLoading: boolean = false;
  isEmpty: boolean = false;
  company_data: any = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      company_name: ['', Validators.required],
      company_activity_field: ['', Validators.required],
      company_representative_id: ['', Validators.required],
      company_tax_id: ['', Validators.required],
      company_ss_id: ['', Validators.required],
      company_establishment_year: ['', Validators.required],
      active: ['Y', Validators.required],
    });

    this.getCompanyInformations();
  }

  getCompanyInformations(): void {    
    this.isLoading = true;

    this.companyService.getCompanyInformations().subscribe((data) => {        
      if (data.success && data.data) {
        this.isLoading = false;
        this.isEmpty = false;
        this.company_data = Array.isArray(data.data) ? data.data[0] : data.data;

        console.log("company data: ", this.company_data);

        this.companyForm.patchValue({
          company_name: this.company_data.company_name,
          company_activity_field: this.company_data.company_activity_field,
          company_representative_id: this.company_data.company_representative_id,
          company_tax_id: this.company_data.company_tax_id,
          company_ss_id: this.company_data.company_ss_id,
          company_establishment_year: this.company_data.company_establishment_year,
          active: this.company_data.active
        });

      } else {
        this.isLoading = false;
        this.isEmpty = true;
        this.company_data = null;
      }
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.companyForm.invalid) return;

    const updatedData = this.companyForm.value;
    console.log('Updated company info:', updatedData);
  }
}
