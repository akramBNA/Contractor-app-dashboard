import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsService } from '../../../services/missions.services';

@Component({
  selector: 'app-missions-list',
  imports: [],
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.css',
})
export class MissionsListComponent {
  isLoading: boolean = false;
  missions_data: any = [];

  constructor(private missionsService: MissionsService) {}

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
        console.log("No missions found !\nInternal log: ", data.message);
        
      }
    });
  }
}
