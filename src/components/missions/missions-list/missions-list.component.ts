import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsService } from '../../../services/missions.services';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-missions-list',
  imports: [MatIconModule, CommonModule, LoadingSpinnerComponent],
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.css',
})
export class MissionsListComponent {
  isLoading: boolean = false;
  missions_data: any = [];
  paginatedMissions = [];
  limit = 20;
  currentPage = 1;
  totalPages = 1;

  total_missions_count = 0;
  active_missions_count = 0;
  completed_missions_count = 0;
  canceled_missions_count = 0;

  constructor(
    private missionsService: MissionsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllMissions();
  }

  getAllMissions() {
    this.isLoading = true;
    this.missionsService.getAllActiveMissions().subscribe((data: any) => {
      if (data.success) {
        this.isLoading = false;
        this.missions_data = data.data;
      } else {
        this.isLoading = false;
      }
    });
  }

  onEditMission(missionId: string) {    
    this.router.navigate(['/main-page/missions/mission-details', missionId]);
  }

  onDeleteMission(missionId: string) {}
}
