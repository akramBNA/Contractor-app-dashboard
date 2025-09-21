import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContractTypesService } from '../../../services/contract_types.services';
import { SwalService } from '../../../shared/Swal/swal.service';

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

  constructor(
    private contractTypesService: ContractTypesService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.getContractTypes();
  };

  getContractTypes(): void {
    this.isLoading = true;
    this.contractTypesService.getAllContractTypes().subscribe({
      next: (response) => {
        if(response.success){
          this.contract_types_data = response.data;
          this.overall_count = response.data.length;
          this.isLoading = false;
        } else {
          this.contract_types_data = [];
          this.overall_count = 0;
          this.isEmpty = true;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.swalService.showError('Erreur', 'Une erreur est survenue lors de la récupération des types de contrat.');
      }
    });
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
