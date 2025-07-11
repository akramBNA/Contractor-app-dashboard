import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MissionsService } from '../../../services/missions.services';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { EmployeesService } from '../../../services/employees.services';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-missions',
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './add-missions.component.html',
  styleUrl: './add-missions.component.css'
})
export class AddMissionsComponent implements OnInit{
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
      mission_nom: ['', Validators.required],
      mission_description: [''],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      priorite: ['', Validators.required],
      frais: ['', [Validators.required, Validators.min(0)]],
      employe_id: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllActiveEmployeesNames();
  }

  getAllActiveEmployeesNames() {
    this.employeeService.getAllActiveEmployeesNames().subscribe((data:any) => {
      this.employeesList = data.data;
    })
  }

  onSubmitMission() {}
}
