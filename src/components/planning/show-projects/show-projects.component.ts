import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../services/projects.services';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SwalService } from '../../../shared/Swal/swal.service';

@Component({
  selector: 'app-show-projects',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './show-projects.component.html',
  styleUrl: './show-projects.component.css',
})
export class ShowProjectsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  projects_data: any[] = [];
  isLoading: boolean = false;
  projects_flag: boolean = false;

  limit = 20;
  offset = 0;
  keyword = new FormControl('');

  totalItems = 0;
  pageSizesOptions = [3, 20, 50, 100];

  projectStats = {
    notStarted: 0,
    inProgress: 0,
    finished: 0,
    canceled: 0,
  };

  constructor(
    private projectService: ProjectsService, 
    private router: Router,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.fetchProjects(this.limit, this.offset, this.keyword.value ?? '');

    this.keyword.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value: string | null) => {
        this.offset = 0;
        this.fetchProjects(this.limit, this.offset, (value ?? '').trim());
      });
  }

  fetchProjects(limit: number, offset: number, keyword: string) {
    this.projects_flag = false;
    this.isLoading = true;
    this.projectService.getAllProjects(limit, offset, keyword).subscribe((data: any) => {
      this.isLoading = false;
      if (data.success) {
        if(data.data.length === 0) {
          this.projects_flag = true;
          this.totalItems = 0;
          this.projectStats = {
            notStarted: 0,
            inProgress: 0,
            finished: 0,
            canceled: 0,
          }
        };
        this.projects_data = data.data;
        this.totalItems = data.attributes.total;
        this.projectStats = data.stats;
      } else {
        this.projects_data = [];
        this.totalItems = 0;
        this.projectStats = {
          notStarted: 0,
          inProgress: 0,
          finished: 0,
          canceled: 0,
        };
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.fetchProjects(this.limit, this.offset, this.keyword.value ?? '');
  }

  clearSearch() {
    this.keyword.setValue('');
    this.offset = 0;
    this.fetchProjects(this.limit, this.offset, '');
  }

  ViewProject(projectId: number) {
    this.router.navigate(['/main-page/planning/view-project', projectId]);
  }

  DeleteProject(projectId: number) {
    this.swalService.showConfirmation('Êtes-vous sûr de vouloir supprimer ce projet ?').then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.projectService.deleteProject(projectId).subscribe((data: any) => {
          if (data.success) {
            this.isLoading = false;
            this.swalService.showSuccess('Ce projet a été supprimé avec succès.').then(() => {
            });
          } else {
            this.isLoading = false;
            this.swalService.showError('Une erreur s\'est produite lors de la suppression de ce projet.');
          }
        });
      }
    });
  }
}
