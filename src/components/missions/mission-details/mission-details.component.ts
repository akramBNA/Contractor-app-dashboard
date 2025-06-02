import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MissionsService } from '../../../services/missions.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-mission-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './mission-details.component.html',
  styleUrl: './mission-details.component.css',
})
export class MissionDetailsComponent implements OnInit {
  isLoading: boolean = false;
  missionForm!: FormGroup;

  constructor(
    private missionsService: MissionsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const missionId = window.location.pathname.split('/').pop();
    if (missionId) {
      this.initForm();
      this.getMissionDetails(missionId);
    } else {
      console.error('Mission ID not found in the URL');
    }
  }

  initForm() {
    this.missionForm = this.fb.group({
      mission_name: ['', Validators.required],
      mission_description: [''],
      start_at: ['', Validators.required],
      end_at: [''],
      priority: ['', Validators.required],
      expenses: [0, [Validators.required, Validators.min(0)]],
    });
  }

  getMissionDetails(missionId: string) {
    this.isLoading = true;
    this.missionsService
      .getMissionById(missionId)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (response.success) {
          const mission = response.data;
          this.missionForm.patchValue({
            mission_name: mission.mission_name,
            mission_description: mission.mission_description,
            start_at: mission.start_at,
            end_at: mission.end_at,
            priority: mission.priority,
            expenses: mission.expenses,
          });
        } else {
          console.error('No mission found', response.message);
        }
      });
  }

  updateMission() {}

  downloadPDF(): void {
    const element = document.getElementById('pdfContent');
    console.log("element", element);
    
    const options = {
      margin: 0.5,
      filename: 'mission-details.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    if (element) {
      html2pdf().from(element).set(options).save();
    }
  }

  goBack() {
    this.router.navigate(['/main-page/missions/missions-list']);
  }
}
