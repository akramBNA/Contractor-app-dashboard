import { Component, ViewEncapsulation } from '@angular/core';
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
import { SwalService } from '../../../shared/Swal/swal.service';
import { EmployeesService } from '../../../services/employees.services';

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
  encapsulation: ViewEncapsulation.None,
})
export class AddProjectComponent {
  projectForm: FormGroup;
  isLoading: boolean = false;
  formSubmitted: boolean = false;
  employeesList: any[] = [];


  constructor(
    private projectService: ProjectsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private swalService: SwalService,
    private employeesService: EmployeesService
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


  ngOnInit() {
    this.getAllActiveEmployeesNames();
  }

  getAllActiveEmployeesNames() {
    this.employeesService.getAllActiveEmployeesNames().subscribe((data: any) => {
     if(data.success) {
        this.employeesList = data.data
        console.log("employeesList: ", this.employeesList);
        
      }
    })
  }

  onSubmit() {
    this.formSubmitted = true;
    this.isLoading = true;
    if (this.projectForm.valid) {
      const formData = this.projectForm.value;
      this.projectService.addProject(formData).subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.swalService.showSuccess('Projet ajouté avec succès').then(() => {
            this.projectForm.reset();
            this.router.navigate(['/main-page/planning/show-project']);
          });
        } else {
          this.isLoading = false;
          this.swalService.showError('Une erreur s\'est produite lors de l\'ajout du projet.').then(() => {
            this.projectForm.reset();
            this.router.navigate(['/main-page/planning/show-project']);
          });
        }
      });
    }else{
      this.isLoading = false;
      this.projectForm.markAllAsTouched();
      this.swalService.showWarning('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  }
}
