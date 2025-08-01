import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { LeavesService } from '../../../../services/leaves.services';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";

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
  constructor(
    private leavesService: LeavesService
  ) {}

  ngOnInit() {
    this.fetchLeaves(this.limit, this.offset);
  }

  fetchLeaves(lim: number, off: number) {
    this.isLoading = true;
    this.isEmpty = false;
    this.leavesService.getAllLeaves(lim, off).subscribe((data: any) => {
      if(data.success){
        this.leaves_data = data.data;
        this.total_count = data.attributes.total;
        this.isEmpty = this.leaves_data.length === 0;
      } else {
        this.isLoading = false;
        this.leaves_data = [];
        this.total_count = 0;
        // this.isEmpty = true;
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.fetchLeaves( this.limit, this.offset);
  };
  
  acceptLeave(employeeId: number, leaveId: number) {
  };

  rejectLeave(employeeId: number, leaveId: number) {};
}
