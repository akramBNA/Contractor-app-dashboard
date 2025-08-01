import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { LeavesService } from '../../../../services/leaves.services';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { SwalService } from '../../../../shared/Swal/swal.service';

@Component({
  selector: 'app-leaves-list',
  imports: [CommonModule, LoadingSpinnerComponent, MatInputModule, MatIconModule, MatPaginatorModule],
  templateUrl: './leaves-list.component.html',
  styleUrl: './leaves-list.component.css'
})
export class LeavesListComponent {
  isLoading: boolean = false;
  isEmpty: boolean = false;
  leaves_data: any[] = [];
  total_count: number = 0;
  limit: number = 20;
  offset: number = 0;

  translateStatus(status: string): string {
    switch (status) {
      case 'Pending': return 'En attente';
      case 'Approved': return 'Approuvé';
      case 'Rejected': return 'Rejeté';
      default: return status;
    }
  }

  translateLeaveType(type: string): string {
    switch (type) {
      case 'Annual Leave': return 'Congé annuel';
      case 'Sick Leave': return 'Congé maladie';
      case 'Maternity Leave': return 'Congé maternité';
      case 'Unpaid Leave': return 'Congé sans solde';
      default: return type;
    }
  }

  constructor(
    private leavesService: LeavesService,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.fetchLeaves(this.limit, this.offset);
  }

  fetchLeaves(lim: number, off: number) {
    this.isLoading = true;
    this.isEmpty = false;
    this.leavesService.getAllLeaves(lim, off).subscribe((data: any) => {
      
      if(data.success){
        this.isLoading = false;
        this.isEmpty = data.data.length === 0;
        this.leaves_data = data.data;
        this.total_count = data.attributes.total;
      } else {
        this.isLoading = false;
        this.leaves_data = [];
        this.total_count = 0;
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.fetchLeaves( this.limit, this.offset);
  };

  acceptLeave(employeeId: number, leaveId: number) {
    this.isLoading = true;
    this.leavesService.acceptLeaves(employeeId, leaveId, {}).subscribe((data: any) => {
      if(data.success) {
        this.isLoading = false;
        this.swalService.showSuccess("Congé accepté avec succès").then(() => {
          this.fetchLeaves(this.limit, this.offset);
        })
      } else {
        this.isLoading = false;
        this.swalService.showError("Échec de l'acceptation du congé").then(() => {
          this.fetchLeaves(this.limit, this.offset);
        });
      }
    }
    )
  };
    

  rejectLeave(employeeId: number, leaveId: number) {
    this.isLoading = true;
    this.leavesService.rejectLeaves(employeeId, leaveId, {}).subscribe((data: any) => {
      if(data.success) {
        this.isLoading = false;
        this.swalService.showSuccess("Congé rejeté avec succès").then(() => {
          this.fetchLeaves(this.limit, this.offset);
        })
      } else {
        this.isLoading = false;
        this.swalService.showError("Échec du rejet du congé").then(() => {
          this.fetchLeaves(this.limit, this.offset);
        });
      }
    })
  };
}
