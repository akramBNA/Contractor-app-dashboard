import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MissionsService } from '../../../services/missions.services';
import { AddMissionsComponent } from '../add-missions/add-missions.component';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-missions-list',
  imports: [
    MatIconModule,
    CommonModule,
    LoadingSpinnerComponent,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.css',
})
export class MissionsListComponent {
  isLoading: boolean = false;
  missions_data: any = [];
  isEmpty: boolean = false;
  isMobile: boolean = false;

  limit: number = 20;
  offset: number = 0;
  keyword: string = '';
  keywordControl: FormControl = new FormControl('');

  total_missions: number = 0;

  page_size_options: number[] = [2, 10, 20, 50, 100];

  active_missions_count = 0;
  completed_missions_count = 0;
  canceled_missions_count = 0;
  overall_count: number = 0;

  loadingMap: { [key: string]: boolean } = {};

  priorityMap: { [key: string]: string } = {
    LOW: 'Faible',
    MEDIUM: 'Moyenne',
    HIGH: 'Élevée',
  };

  constructor(
    private missionsService: MissionsService,
    private router: Router,
    private swalService: SwalService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    this.getAllMissions(this.limit, this.offset, this.keyword ?? '');

    this.keywordControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value: string | null) => {
        this.offset = 0;
        this.getAllMissions(this.limit, this.offset, (value ?? '').trim());
      });
  }

  clearSearch() {
    this.keywordControl.setValue('');
  }

  getAllMissions(lim: number, off: number, key: string) {
    this.isEmpty = false;
    this.isLoading = true;
    this.missionsService
      .getAllActiveMissions(lim, off, key)
      .subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.missions_data = data.data;
          this.overall_count = data.attributes.overall_count;
          this.active_missions_count = data.running_missions;
          this.completed_missions_count = data.completed_missions;
        } else {
          this.isLoading = false;
          this.isEmpty = true;
          this.missions_data = [];
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
        if (!result.isConfirmed) return;

        const backup = [...this.missions_data];
        const deletedMission = this.missions_data.find(
          (m: any) => m.mission_id === missionId,
        );

        this.missions_data = this.missions_data.filter(
          (m: any) => m.mission_id !== missionId,
        );
        this.overall_count = this.missions_data.length;

        this.swalService.showUndo('Mission supprimée', 5000).then((undoClicked: boolean) => {
            if (undoClicked) {
              this.missions_data = backup;
              this.overall_count = this.missions_data.length;
              return;
            }
            this.loadingMap[missionId] = true;

            this.missionsService.deleteMission(missionId).pipe(finalize(() => {
                  this.loadingMap[missionId] = false;
                }),
              ).subscribe({
                next: (res: any) => {
                  this.loadingMap[missionId] = false;

                  if (!res.success) {
                    this.missions_data = backup;
                    this.swalService.showError(
                      'Erreur lors de la suppression.',
                    );
                  }
                },
                error: () => {
                  this.loadingMap[missionId] = false;
                  this.missions_data = backup;
                  this.swalService.showError('Erreur serveur.');
                },
              });
          });
      });
  }

  openAddMissionDialog() {
    const dialogRef = this.dialog.open(AddMissionsComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.getAllMissions(this.limit, this.offset, this.keyword);
      }
    });
  }
}
