import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css'],
  imports: [CommonModule ,MatInputModule, MatSelectModule, ReactiveFormsModule]
})
export class CompanySettingsComponent implements OnInit {
  companyForm!: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {}

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
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.companyForm.valid) {
      console.log('Form values:', this.companyForm.value);
      // 🔥 Here call your API (e.g. CompanyService.updateCompany(...))
    }
  }
}
