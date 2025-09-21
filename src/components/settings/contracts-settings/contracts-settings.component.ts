import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contracts-settings',
  imports: [CommonModule,LoadingSpinnerComponent, MatSelectModule, MatIconModule, MatPaginatorModule, ReactiveFormsModule],
  templateUrl: './contracts-settings.component.html',
  styleUrl: './contracts-settings.component.css'
})
export class ContractsSettingsComponent {
  isLoading: boolean = false;
  isEmpty: boolean = false;

  contract_types_data: any[] = [];
  total_contracts_count: number = 0;

  overall_count: number = 0;
  active_contracts_count: number = 0;
  inactive_contracts_count: number = 0;

  ngOnInit(): void {
    // Initialization logic here
  };

  onEditContractType(contractTypeId: number): void {
    // Logic to edit contract type
  };

  onDeleteContractType(contractTypeId: number): void {
    // Logic to delete contract type
  };

  onPageChange(event: any): void {
    // Logic to handle page change
  };
}
