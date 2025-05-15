import { Component, inject, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ProjectsService } from '../../../services/projects.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
  encapsulation: ViewEncapsulation.None, // 👈 important
})
export class AddProjectComponent {
  projectForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private projectService: ProjectsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.projectForm = this.formBuilder.group({
      project_name: ['', Validators.required],
      description: ['', Validators.required],
      assigned_to: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.isLoading = true;
      const formData = this.projectForm.value;
      this.projectService.addProject(formData).subscribe((data: any) => {
        console.log('data ====> ', data);
        if (data.success) {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Projet Ajouté!',
          }).then(() => {
            this.projectForm.reset();
            this.router.navigate(['/main-page/planning/show-project']);
          });
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Il y a eu une erreur lors de l\'ajout du projet.',
          }).then(() => {
            this.projectForm.reset();
          });
        }
      });
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'Veuillez remplir tous les champs obligatoires.',
      });
    }
  }
}
