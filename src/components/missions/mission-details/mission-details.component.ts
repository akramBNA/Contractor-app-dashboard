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
import Swal from 'sweetalert2';


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
  assignedEmployees: any[] = [];
  temp_emp_ids: any[] = [];
  mission_id: string = '';

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
      mission_id: [''],
      mission_name: ['', Validators.required],
      mission_description: [''],
      start_at: ['', Validators.required],
      end_at: [''],
      priority: ['', Validators.required],
      expenses: [0, [Validators.required, Validators.min(0)]],
      employee_id: []
    });
  }

  getMissionDetails(missionId: string) {
    this.isLoading = true;
    this.missionsService.getMissionById(missionId).subscribe((response: any) => {
      if (response.success) {
          this.isLoading = false;
          this.missionData = response.data;
          
          this.assignedEmployees = Array.isArray(this.missionData?.assigned_employees) ? this.missionData.assigned_employees : [];
          this.assignedEmployees= this.missionData?.assigned_employees;

          for(let i = 0; i < this.assignedEmployees.length; i++) {
            this.temp_emp_ids.push(this.assignedEmployees[i].employee_id);
          }
          
          this.mission_id = response.data.mission_id;
          
          this.missionForm.patchValue({
            mission_name: this.missionData.mission_name,
            mission_description: this.missionData.mission_description,
            start_at: this.missionData.start_at,
            end_at: this.missionData.end_at,
            priority: this.missionData.priority,
            expenses: this.missionData.expenses,
            employee_id: this.temp_emp_ids
          });          
        } else {
          this.isLoading = false;
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur s\'est produit !.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/main-page/missions/missions-list']);
          });
        }
      });
  }

  updateMission() {
    this.isLoading = true;

    if(!this.missionForm.valid) {
      this.isLoading = false;
      Swal.fire({
        title: 'Attention',
        text: 'Veuiller controlez vos données.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
      })
    }

    this.missionsService.editMission(this.mission_id, this.missionForm.value).subscribe((response: any) => {
      if (response.success) {
          this.isLoading = false;
          Swal.fire({
            title: 'Succès',
            text: 'Mission mise à jour avec succès.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/main-page/missions/missions-list']);
          })
        } else {
          this.isLoading = false;
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la mise à jour de la mission.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    );
  }

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
