import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from "@angular/material/paginator";

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
  constructor() {}

  ngOnInit() {}

  onPageChange(event:any){}

  acceptLeave(employeeId: number, leaveId: number) {
  };

  rejectLeave(employeeId: number, leaveId: number) {};
}
