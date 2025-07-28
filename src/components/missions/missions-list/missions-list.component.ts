import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsService } from '../../../services/missions.services';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatInputModule } from "@angular/material/input";


@Component({
  selector: 'app-missions-list',
  imports: [MatIconModule, CommonModule, LoadingSpinnerComponent, MatPaginatorModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.css',
})
export class MissionsListComponent {
  isLoading: boolean = false;
  missions_data: any = [];

  limit:number = 20;
  offset:number = 0;
  keyword: string = '';
  keywordControl: FormControl = new FormControl('');


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
    private router: Router,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.getAllMissions(this.limit, this.offset, this.keyword ?? '');

    this.keywordControl.valueChanges.pipe(debounceTime(500)).subscribe((value: string | null) => {
       this.offset = 0;
      this.getAllMissions(this.limit, this.offset, (value ?? '').trim());
    });
  }

  clearSearch() {
    this.keywordControl.setValue('');
  }

  getAllMissions(lim:number, off:number, key:string) {
    this.isLoading = true;
    this.missionsService.getAllActiveMissions(lim, off, key).subscribe((data: any) => {
      console.log("data: ", data);
      
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

  onDeleteMission(missionId: string) {
    this.swalService.showConfirmation('Êtes-vous sûr de vouloir supprimer cette mission ?').then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.missionsService.deleteMission(missionId).subscribe((data: any) => {
          if (data.success) {
            this.isLoading = false;
            this.swalService.showSuccess('La mission a été supprimé avec succès.').then(() => {
            });
          } else {
            this.isLoading = false;
            this.swalService.showError('Une erreur s\'est produite lors de la suppression de cette mission.');
          }
        });
      }
    });
  }
}
