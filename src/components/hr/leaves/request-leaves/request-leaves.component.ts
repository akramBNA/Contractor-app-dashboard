import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { LeavesService } from '../../../../services/leaves.services';
import { SwalService } from '../../../../shared/Swal/swal.service';
import { LeavesTypesService } from '../../../../services/leave_types.services';
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
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);


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
  employeeID: number = 1;
  leave_balance: number = 0;

  total_count: number = 0;
  approved_count: number = 0;
  rejected_count: number = 0;
  pending_count: number = 0;

  minStartDate = new Date();
  minEndDate: Date | null = null;

    statusTranslations: { [key: string]: string } = {
      Pending: 'En attente',
      Approved: 'Approuvé',
      Rejected: 'Rejeté',
    };

    leaveTypeTranslations: { [key: string]: string } = {
      'Annual Leave': 'Congé Annuel',
      'Sick Leave': 'Congé Maladie',
      'Maternity Leave': 'Congé Maternité',
      'Unpaid Leave': 'Congé sans solde',
    };

    translateStatus(status: string): string {
      return this.statusTranslations[status] || status;
    }

    translateLeaveType(type: string): string {
      return this.leaveTypeTranslations[type] || type;
    }

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
    this.employeeID = parseInt(sessionStorage.getItem('user_id') || '1', 10);
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
      } else {
        this.leave_types_data = [];
      }
    })
  }

  getAllLeavesById(limit: number, offset: number, employeeId: number) {
    this.isLoading = true;
    this.leaveServices.getLeavesByEmployeeId(limit, offset, employeeId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (!response.success || !response.data) {
          this.leaves_data = [];
          this.isEmpty = true;
          return;
        }

        this.leaves_data = response.data;
        this.leave_balance = response.stats?.leave_credit;
        this.total_count = response.attributes?.total || 0;
        this.approved_count = response.stats?.approved || 0;
        this.pending_count = response.stats?.pending || 0;
        this.rejected_count = response.stats?.rejected || 0;
        this.isEmpty = response.data.length === 0;
        this.renderLeaveDonut();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching leaves:', err);
        this.leaves_data = [];
        this.isEmpty = true;
      }
    });
  }

  renderLeaveDonut() {
    const totalLeaves = 30;
    const usedLeaves = this.leave_balance;
    const remaining = totalLeaves - usedLeaves;

    const ctx = document.getElementById('leaveDonutChart') as HTMLCanvasElement;

    if (ctx && Chart.getChart(ctx)) {
      Chart.getChart(ctx)?.destroy();
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Utilisés', 'Restants'],
        datasets: [{
          data: [usedLeaves, remaining],
          backgroundColor: ['#f87171', '#34d399'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} jours`
            }
          }
        }
      }
    });
  }

  formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
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

    this.isLoading = true;
    this.leaveServices.requestLeave(payload).subscribe((data:any) => {      
      if(data.success) {
        this.isLoading = false;
        this.swalService.showSuccess('Demande de congé envoyée avec succès.').then(() => {
          this.requestLeavesForm.reset();
        })
      }else {        
        this.isLoading = false;
        this.swalService.showError('Erreur lors de l\'envoi de la demande de congé. Veuillez réessayer plus tard.').then(() => {
        });
      }
    });
  }

  deleteLeave(leave_id: number){    
    this.isLoading = true;
    this.leaveServices.deleteLeaves(leave_id, {}).subscribe((data:any) => {
      if(data.success){
        this.isLoading = false;
        this.swalService.showConfirmation("Etes-vous sur de vouloir supprimé ce congé ?").then(()=>{
          this.swalService.showSuccess('Le congé a été supprimé avec succès !').then(() => {
            this.getAllLeavesById(this.limit, this.offset, this.employeeID);
          })
        })
      } else {
        this.isLoading = false;
        this.swalService.showError("Le congé n\'est pas suprimé");
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getAllLeavesById( this.limit, this.offset, this.employeeID);
  }
}
