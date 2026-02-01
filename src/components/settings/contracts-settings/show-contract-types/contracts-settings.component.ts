import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from "../../../../shared/loading-spinner/loading-spinner.component";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ContractTypesService } from '../../../../services/contract_types.services';
import { SwalService } from '../../../../shared/Swal/swal.service';
import { MatDialog } from '@angular/material/dialog';
import { addContractTypeFormDialogComponent } from '../add-contract-types/add-contract-types.component';
import { ContractTypeFormDialogComponent } from '../edit-contract-types/edit-contract-types.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-contracts-settings',
  imports: [CommonModule,LoadingSpinnerComponent, MatSelectModule, MatIconModule, MatPaginatorModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './contracts-settings.component.html',
  styleUrl: './contracts-settings.component.css'
})
export class ContractsSettingsComponent {
  isLoading: boolean = false;
  isEmpty: boolean = false;

  limit: number = 10;
  offset: number = 0;
  keywordControl: FormControl = new FormControl('');

  contract_types_data: any[] = [];
  total_contracts_count: number = 0;

  overall_count: number = 0;
  active_contracts_count: number = 0;
  inactive_contracts_count: number = 0;

  constructor(
    private contractTypesService: ContractTypesService,
    private swalService: SwalService,
    private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.getContractTypes(this.limit, this.offset, '');

    this.keywordControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value: string | null) => {
            this.offset = 0;
            this.getContractTypes(
              this.limit,
              this.offset,
              (value ?? '').trim()
            );
          });
  };

  getContractTypes(lim:number, off: number, key: string): void {
    this.isLoading = true;
    this.contractTypesService.getAllContractTypes(lim, off, key).subscribe({
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

  onAddContractType(): void {
    const dialogRef = this.dialog.open(addContractTypeFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((newData) => {
      if (newData) {
        this.contract_types_data = [newData, ...this.contract_types_data];
        this.overall_count = this.contract_types_data.length;
        this.isEmpty = false;
      }
    });
  };

  onEditContractType(contractType: any): void {
    const dialogRef = this.dialog.open(ContractTypeFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: contractType
    });

    dialogRef.afterClosed().subscribe((updatedData) => {
      if (updatedData) {
        const index = this.contract_types_data.findIndex(
          ct => ct.contract_type_id === updatedData.contract_type_id
        );

        if (index !== -1) {
          this.contract_types_data[index] = updatedData;
          this.contract_types_data = [...this.contract_types_data];
        }
      }
    });
  };


  onDeleteContractType(contractTypeId: number): void {
    this.swalService.showConfirmation('Voulez-vous vraiment supprimer ce type de contrat ?').then((result: any) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.contractTypesService.deleteContractType(contractTypeId).subscribe({
          next: (response) => {
            if (response.success) {
              this.contract_types_data = this.contract_types_data.filter(
                ct => ct.contract_type_id !== contractTypeId
              );

              this.overall_count = this.contract_types_data.length;
              this.isEmpty = this.overall_count === 0;

              this.swalService.showSuccess('Le type de contrat a été supprimé avec succès.');
            } else {
              this.swalService.showError('Erreur', response.message || 'Impossible de supprimer ce type de contrat.');
            }

            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.swalService.showError('Erreur','Une erreur est survenue lors de la suppression.');
          }
        });
      }
    });
  };


  onPageChange(event: any): void {
    // Logic to handle page change
  };



  clearSearch(): void {
    this.keywordControl.setValue('');
    this.getContractTypes(this.limit, this.offset, '');
  };
}