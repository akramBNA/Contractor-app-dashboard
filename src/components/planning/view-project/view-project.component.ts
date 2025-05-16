import { Component } from '@angular/core';
import { ProjectsService } from '../../../services/projects.services';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-project',
  imports: [CommonModule],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css',
})
export class ViewProjectComponent {
  project_data: any = [];
  isLoading: boolean = false;

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    const project_id = this.route.snapshot.paramMap.get('id');
    console.log('Project ID:: ', project_id);

    if (project_id !== null) {
      this.getProjectById(Number(project_id));
    } else {
      console.error('Project ID is null');
    }
  }

  getProjectById(project_id: number) {
    this.isLoading = true;
    this.projectsService.getProjectById(project_id).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        if (data.success) {
          this.project_data = data.data;
          console.log('Project details:', this.project_data);
        } else {
          console.error('Error fetching project details:', data.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('API error:', err);
      },
    });
  }
  goBack(): void {
    this.router.navigate(['/main-page/planning/show-project']);
  }
}
