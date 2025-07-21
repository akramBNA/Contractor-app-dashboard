import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../services/projects.services';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-show-projects',
  imports: [CommonModule, LoadingSpinnerComponent, FormsModule, MatIconModule, MatPaginatorModule],
  templateUrl: './show-projects.component.html',
  styleUrl: './show-projects.component.css',
})
export class ShowProjectsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  projects_data: any[] = [];
  isLoading = false;

  limit = 20;
  offset = 0;
  keyword = '';

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
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProjects(this.limit, this.offset, this.keyword);
  }

  fetchProjects(limit: number, offset: number, keyword: string) {
    this.isLoading = true;
    this.projectService.getAllProjects(limit, offset, keyword).subscribe((data: any) => {
      this.isLoading = false;
      if (data.success) {
        this.projects_data = data.data;
        this.totalItems = data.attributes.total;
        this.projectStats = data.stats;
      }
    });
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.fetchProjects(this.limit, this.offset, this.keyword);
  }

  ViewProject(projectId: number) {
    this.router.navigate(['/main-page/planning/view-project', projectId]);
  }

  DeleteProject(projectId: number) {
    // to be implemented
  }
}
