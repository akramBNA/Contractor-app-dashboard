import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';
import { MissionsService } from '../../../services/missions.services';
import { EmployeesService } from '../../../services/employees.services';

@Component({
  selector: 'app-add-missions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-missions.component.html',
  styleUrls: ['./add-missions.component.css'],
})
export class AddMissionsComponent implements OnInit {
  missionForm: FormGroup;
  isLoading = false;
  employeesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private missionService: MissionsService,
    private employeeService: EmployeesService,
    private router: Router
  ) {
    this.missionForm = this.fb.group({
      mission_name: ['', Validators.required],
      mission_description: [''],
      start_at: ['', Validators.required],
      end_at: ['', Validators.required],
      priority: ['', Validators.required],
      expenses: ['', [Validators.required, Validators.min(0)]],
      employee_id: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllActiveEmployeesNames();
  }

  getAllActiveEmployeesNames() {
    this.employeeService.getAllActiveEmployeesNames().subscribe((data: any) => {
      this.employeesList = data.data;
    });
  }

  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmitMission() {

    const formData = {
      ...this.missionForm.value,
      date_debut: this.formatDate(this.missionForm.value.date_debut),
      date_fin: this.formatDate(this.missionForm.value.date_fin),
    }

    console.log("Mission Form Value: ", formData);
    console.log("Mission Form Valid: ", this.missionForm.valid);
    
    
    if (!this.missionForm.valid) {
      Swal.fire({
        title: 'Attention',
        text: 'Veuillez remplir tous les champs obligatoires',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }

      this.missionService.addMission(formData).subscribe((data: any) => {
        console.log("data: ", data);
        
          this.isLoading = true;
          if (data.success) {
            this.isLoading = false;
            Swal.fire({
              title: 'Succès',
              text: 'Mission ajoutée avec succès',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.missionForm.reset();
              this.router.navigate(['/missions']);
            });
          } else {
            this.isLoading = false;
            Swal.fire({
              title: 'Erreur',
              text: "Une erreur s'est produite lors de l'ajout de la mission",
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        });
    }
  }
