import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { CompanyService } from '../../../services/company.services';
import { SwalService } from '../../../shared/Swal/swal.service';
import { Router } from '@angular/router';

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
    private companyService: CompanyService,
    private swalService: SwalService,
    private router: Router
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
      employee_name: [''],
      employee_lastname: [''],
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
          active: this.company_data.active,
          employee_name: this.company_data.employee_name,
          employee_lastname: this.company_data.employee_lastname,
        });

      } else {
        this.isLoading = false;
        this.isEmpty = true;
        this.company_data = null;
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;

    if (this.companyForm.invalid || !this.company_data) {
      return;
    }

    const updatedCompanyData = {
      company_id: this.company_data.company_id,
      ...this.companyForm.value,
    };

    console.log("Submitting updated data:", updatedCompanyData);

    this.companyService.updateCompany(updatedCompanyData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.swalService.showSuccess("Informations de l'entreprise mises à jour avec succès.");
          this.company_data = res.data;
        } else {
          this.swalService.showError("Échec de la mise à jour des informations de l'entreprise.");
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.swalService.showError("Une erreur est survenue lors de la mise à jour des informations de l'entreprise.");
      },
    });
  };
}
