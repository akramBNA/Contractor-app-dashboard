import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsService } from '../../../services/missions.services';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-missions-list',
  imports: [MatIconModule, CommonModule, MatProgressSpinnerModule],
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

  constructor(private missionsService: MissionsService) {}

  ngOnInit() {
    this.getAllMissions();
  }

  getAllMissions() {
    this.isLoading = true;
    this.missionsService.getAllActiveMissions().subscribe((data: any) => {
      console.log("data ?? ", data);
      
      if (data.success) {
        this.isLoading = false;
        this.missions_data = data.data;
      } else {
        this.isLoading = false;
        console.log('No missions found !\nInternal log: ', data.message);
      }
    });
  }

  onEditMission(missionId: string) {}

  onDeleteMission(missionId: string) {}
}
