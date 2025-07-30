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
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";

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
    MatNativeDateModule,
    MatPaginatorModule,
    MatIconModule
],
  templateUrl: './request-leaves.component.html',
  styleUrl: './request-leaves.component.css',
})
export class RequestLeavesComponent {
  isLoading: boolean = false;
  isEmpty: boolean = false;
  limit: number = 20;
  offset: number = 0;
  requestLeavesForm: FormGroup;
  leave_types_data: any[] = [];
  leaves_data: any[] = [];
  employeeID: number = 1; // Temporary value, replace with actual employee ID logic
  total_count: number = 0;

  minStartDate = new Date();
  minEndDate: Date | null = null;

    statusTranslations: { [key: string]: string } = {
      Pending: 'En attente',
      Approved: 'Approuvé',
      Rejected: 'Rejeté',
    };

    // statusColorClass: { [key: string]: string } = {
    //   Pending: 'text-yellow-600 font-semibold',
    //   Approved: 'text-green-600 font-semibold',
    //   Rejected: 'text-red-600 font-semibold',
    // };

    leaveTypeTranslations: { [key: string]: string } = {
      'Annual Leave': 'Congé Annuel',
      'Sick Leave': 'Congé Maladie',
      'Maternity Leave': 'Congé Maternité',
      'Unpaid Leave': 'Congé non rémunéré',
    };

    translateStatus(status: string): string {
      return this.statusTranslations[status] || status;
    }

    translateLeaveType(type: string): string {
      return this.leaveTypeTranslations[type] || type;
    }

    // getStatusClass(status: string): string {
    //   return this.statusColorClass[status] || '';
    // }

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
    this.getAllLeavesById(this.limit, this.offset, this.employeeID);
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

  getAllLeavesById(lim:number, off:number, id:number) {
   this.leaveServices.getLeavesByEmployeeId(lim, off, id).subscribe((data:any) => {
      if(data.success){
        if(data.data.length === 0) {
          this.isEmpty = true;
          this.leaves_data = [];
        };
        this.leaves_data = data.data;
        this.total_count = data.attributes.total;
        console.log("leaves data: ", data);
      } else {
        this.leaves_data = [];
      }   
    })
  }

  formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  requestLeave() {
    if(!this.requestLeavesForm.valid) {
      this.swalService.showWarning('Veuillez remplir tous les champs requis.');
    }

    const payload = {
    ...this.requestLeavesForm.value,
    employee_id: this.employeeID,
    start_date: this.formatDateToLocal(this.requestLeavesForm.value.start_date),
    end_date: this.formatDateToLocal(this.requestLeavesForm.value.end_date),
  };
    console.log("--- payload: ", payload);
    
    this.isLoading = true;
    this.leaveServices.requestLeave(payload).subscribe((data:any) => {
      console.log("data: ", data);
      
      if(data.success) {
        this.isLoading = false;
        this.swalService.showSuccess('Demande de congé envoyée avec succès.').then(() => {
          this.requestLeavesForm.reset();
        })
      }else {
        console.log("here ?");
        
        this.isLoading = false;
        this.swalService.showError('Erreur lors de l\'envoi de la demande de congé. Veuillez réessayer plus tard.').then(() => {
        });
      }
    });
  }

  deleteLeave(){}

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getAllLeavesById( this.limit, this.offset, this.employeeID);
  }
}
