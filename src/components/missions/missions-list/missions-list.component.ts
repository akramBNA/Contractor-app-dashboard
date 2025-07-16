import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsService } from '../../../services/missions.services';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-missions-list',
  imports: [MatIconModule, CommonModule, LoadingSpinnerComponent, MatPaginatorModule],
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.css',
})
export class MissionsListComponent {
  isLoading: boolean = false;
  missions_data: any = [];

  limit:number = 20;
  offset:number = 0;
  keyword: string = '';

  total_missions: number = 0;

  page_size_options: number[] = [2, 10, 20, 50, 100];

  total_missions_count = 0;
  active_missions_count = 0;
  completed_missions_count = 0;
  canceled_missions_count = 0;

  priorityMap: { [key: string]: string } = {
    LOW: 'Faible',
    MEDIUM: 'Moyenne',
    HIGH: 'Élevée'
  };

  constructor(
    private missionsService: MissionsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllMissions(this.limit, this.offset, this.keyword);
  }

  getAllMissions(lim:number, off:number, key:string) {
    this.isLoading = true;
    this.missionsService.getAllActiveMissions(lim, off, key).subscribe((data: any) => {
      if (data.success) {
        this.isLoading = false;
        this.missions_data = data.data;
        this.total_missions_count = data.attributes.total;
        this.active_missions_count = data.running_missions;
        this.completed_missions_count = data.completed_missions;
      } else {
        this.isLoading = false;
      }
    });
  }

  onEditMission(missionId: string) {    
    this.router.navigate(['/main-page/missions/mission-details', missionId]);
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getAllMissions(this.limit, this.offset, this.keyword);
  }

  onDeleteMission(missionId: string) {}
}
