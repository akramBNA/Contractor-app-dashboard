import { Component } from '@angular/core';
import { LeavesService } from '../../../../services/leaves.services';
import { LeavesTypesService } from '../../../../services/leave_types.services';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { SwalService } from '../../../../shared/Swal/swal.service';
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { LoadingSpinnerComponent } from "../../../../shared/loading-spinner/loading-spinner.component";
import { SocketService } from '../../../../services/socket.services';

@Component({
  selector: 'app-my-leaves',
  imports: [CommonModule, MatIconModule, MatPaginatorModule, LoadingSpinnerComponent],
  templateUrl: './my-leaves.component.html',
  styleUrl: './my-leaves.component.css'
})
export class MyLeavesComponent {
  isLoading: boolean = false;
  isEmpty: boolean = false;
  limit: number = 20;
  offset: number = 0;
  leaves_data: any[] = [];
  leave_types_data: any[] = [];
  leave_balance: number = 0;
  
  total_count: number = 0;
  approved_count: number = 0;
  pending_count: number = 0;
  rejected_count: number = 0;
  
  employeeID: number = 1;
  user_role: string = '';

   leaveTypeTranslations: { [key: string]: string } = {
      'Annual Leave': 'Congé Annuel',
      'Sick Leave': 'Congé Maladie',
      'Maternity Leave': 'Congé Maternité',
      'Unpaid Leave': 'Congé sans solde',
    };

    statusTranslations: { [key: string]: string } = {
      Pending: 'En attente',
      Approved: 'Approuvé',
      Rejected: 'Rejeté',
    };

    translateStatus(status: string): string {
      return this.statusTranslations[status] || status;
    };

    translateLeaveType(type: string): string {
      return this.leaveTypeTranslations[type] || type;
    }

  constructor(
    private leaveServices: LeavesService,
    private leaveTypesService: LeavesTypesService, 
    private swalService: SwalService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.employeeID = parseInt(sessionStorage.getItem('user_id') || '1', 10);
    this.user_role = sessionStorage.getItem('user_role') || '';
    console.log("sessions storage data =====> ", this.employeeID, " - ",this.user_role);
    
    this.getAllLeavesById(this.limit, this.offset, this.employeeID);

    this.socketService.register(this.employeeID, this.user_role);

    this.socketService.onLeaveStatusUpdate((data) => {
      if (data.type === 'approved') {
        this.swalService.showSuccess("Votre congé a été approuvé !");
      }
      if (data.type === 'rejected') {
        this.swalService.showError("Votre congé a été rejeté.");
      }
    });
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
      },
      error: (err) => {
        this.isLoading = false;
        this.leaves_data = [];
        this.isEmpty = true;
      }
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

  deleteLeave(leave_id: number) {
    this.swalService.showConfirmation("Etes-vous sur de vouloir supprimé ce congé ?").then((result) => {
      if (result && result.isConfirmed) {
        this.isLoading = true;
        this.leaveServices.deleteLeaves(leave_id, {}).subscribe({
          next: (data: any) => {
            this.isLoading = false;
            if (data.success) {
              this.swalService.showSuccess('Le congé a été supprimé avec succès !').then(() => {
                this.getAllLeavesById(this.limit, this.offset, this.employeeID);
              });
            } else {
              this.swalService.showError("Le congé n'est pas suprimé");
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.swalService.showError("Erreur lors de la suppression");
          }
        });
      }
    });
  };

  editMyLeave(leave_id: number) {
  };

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getAllLeavesById( this.limit, this.offset, this.employeeID);
  }
}
