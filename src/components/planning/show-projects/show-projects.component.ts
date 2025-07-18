import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../services/projects.services';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-show-projects',
  imports: [CommonModule, LoadingSpinnerComponent, FormsModule, MatIconModule],
  templateUrl: './show-projects.component.html',
  styleUrl: './show-projects.component.css',
})
export class ShowProjectsComponent {
  projects_data: any[] = [];
  paginatedProjects: any[] = [];
  limit = 20;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  projectStats = {
    notStarted: 0,
    inProgress: 0,
    finished: 0,
    canceled: 0,
  };

  constructor(
    private projectService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    this.isLoading = true;
    this.projectService.getAllProjects().subscribe((data: any) => {

      if (data.success) {
        this.isLoading = false;
        this.projects_data = data.data;
        this.paginatedProjects = this.projects_data;
        this.projectStats = data.stats;
      }
    });
  }

  setPageSize(limit: number) {
    this.totalPages = Math.ceil(this.projects_data.length / limit);
    const start = (this.currentPage - 1) * limit;
    const end = start + limit;

    this.paginatedProjects = this.projects_data.slice(start, end);
  }

  ViewProject(projectId: number) {    
    this.router.navigate(['/main-page/planning/view-project', projectId]);
  }

  DeleteProject(projectId: number) {
    // to be continued later
  }
}
