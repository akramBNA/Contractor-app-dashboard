import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ContractTypesService } from '../../../../services/contract_types.services';
import { SwalService } from '../../../../shared/Swal/swal.service';
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-add-contract-type-form-dialog',
  templateUrl: './add-contract-types.component.html',
  imports: [CommonModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class addContractTypeFormDialogComponent {
  form!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private contractTypesService: ContractTypesService,
    private swalService: SwalService,
    private dialogRef: MatDialogRef<addContractTypeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      contract_name: [data.contract_name, Validators.required],
      leaves_credit: [data.leaves_credit, [Validators.required, Validators.min(0)]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    this.contractTypesService.addContractType(this.form.value).subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.success) {
            this.swalService.showSuccess('Un nouveau type de contrat est ajouté avec succès.');

            this.dialogRef.close(response.data);
          } else {
            this.swalService.showError('Erreur', response.message || 'Ajout impossible.');
          }
        },
        error: () => {
          this.isLoading = false;
          this.swalService.showError('Erreur','Une erreur est survenue.');
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
