import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MissionsService } from '../../../services/missions.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-mission-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatChipsModule, MatCardModule],
  templateUrl: './mission-details.component.html',
  styleUrl: './mission-details.component.css',
})
export class MissionDetailsComponent implements OnInit {
  isLoading: boolean = false;
  missionForm!: FormGroup;
  missionData:any = [];

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

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
    this.missionsService.getMissionById(missionId).subscribe((response: any) => {
        this.isLoading = false;
        if (response.success) {
          const mission = response.data;
          this.missionData = response.data;
          
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

  goBack() {
    this.router.navigate(['/main-page/missions/missions-list']);
  }

  downloadPDF(): void {
    if (!this.pdfContent) {
      console.error('PDF target (“#pdfContent”) not found');
      return;
    }

    const element = this.pdfContent.nativeElement as HTMLElement;

    html2canvas(element, { scale: 2, useCORS: true, allowTaint: true, logging: false,})
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);

        const pdfImgWidth = pageWidth - 40;
        const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

        pdf.addImage( imgData, 'JPEG', 20, 20, pdfImgWidth, pdfImgHeight, undefined, 'FAST');

        pdf.save('mission-details.pdf');
      })
      .catch((err) => {
        console.error('Error generating PDF:', err);
      });
  }
}
