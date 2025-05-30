import { Component } from '@angular/core';
import { ProjectsService } from '../../../services/projects.services';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-project',
  imports: [CommonModule, MatProgressSpinner],
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
    const project_id = Number(this.route.snapshot.paramMap.get('id'));

    if (project_id !== null) {
      this.getProjectById(project_id);
    }
  }

  getProjectById(project_id: number) {
    this.isLoading = true;
    this.projectsService.getProjectById(project_id).subscribe((data: any) => {
      if (data.success) {
        this.isLoading = false;
        this.project_data = data.data;
      } else {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            data.message ||
            "une erreur s'est produite lors de la récupération du projet.",
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/main-page/planning/show-project']);
  }
}
