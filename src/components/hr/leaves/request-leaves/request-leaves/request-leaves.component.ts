import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../../../shared/loading-spinner/loading-spinner.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { LeavesService } from '../../../../../services/leaves.services';
import { SwalService } from '../../../../../shared/Swal/swal.service';
import { LeavesTypesService } from '../../../../../services/leave_types.services';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-request-leaves',
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepicker,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  templateUrl: './request-leaves.component.html',
  styleUrl: './request-leaves.component.css',
})
export class RequestLeavesComponent {
  isLoading: boolean = false;
  requestLeavesForm: FormGroup;
  leave_types_data: any[] = [];
  leaves_data: any[] = [];

  minStartDate = new Date();
  minEndDate: Date | null = null;


  constructor(
    private leaveServices: LeavesService,
    private leaveTypesService: LeavesTypesService,
    private swalService: SwalService,
    private fb: FormBuilder
  ) {
    this.requestLeavesForm = this.fb.group({
      employee_id: [0, Validators.required],
      leave_type_id: [0, Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  ngOnInit(){
    this.getAllLeaveTypes();

    this.requestLeavesForm.get('start_date')?.valueChanges.subscribe((startDate: Date) => {
      this.minEndDate = startDate;
    });

  }

  getAllLeaveTypes() {
    this.leaveTypesService.getAllLeaveTypes().subscribe((data:any) => {
      if(data.success){
        this.leave_types_data = data.data;
        console.log("leave types data: ", this.leave_types_data);
        
      } else {
        this.leave_types_data = [];
      }
    })
  }

  getAllLeavesById(){
   
  }

  requestLeave() {
    if(!this.requestLeavesForm.valid) {
      this.swalService.showWarning('Veuillez remplir tous les champs requis.');
    }

    const payload = {
    ...this.requestLeavesForm.value,
    start_date: this.requestLeavesForm.value.start_date.toISOString().split('T')[0],
    end_date: this.requestLeavesForm.value.end_date.toISOString().split('T')[0],
  };

    this.isLoading = true;
    this.leaveServices.requestLeave(payload).subscribe((data:any) => {
      if(data.success) {
        this.swalService.showSuccess('Demande de congé envoyée avec succès.').then(() => {
          this.requestLeavesForm.reset();
          this.isLoading = false;
        })
      }else {
        this.swalService.showError('Erreur lors de l\'envoi de la demande de congé. Veuillez réessayer plus tard.').then(() => {
          this.isLoading = false;
        });
      }
    });
  }
}
