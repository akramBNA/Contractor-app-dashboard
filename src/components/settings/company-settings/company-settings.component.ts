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
  isEmpty: boolean =false;
  company_data:any[] =[];

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
    this.isLoading = true

      this.companyService.getCompanyInformations().subscribe((data)=>{        
        if(data.success){
          this.isLoading = false;
          this.isEmpty = false;
          this.company_data = data.data;
        } else {
          this.isLoading = false;
          this.isEmpty = true;
          this.company_data = []
        }
      })
  }

  onSubmit(): void {}
}
