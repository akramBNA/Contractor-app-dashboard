import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MissionsService } from '../../../services/missions.services';
import { EmployeesService } from '../../../services/employees.services';
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
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { SwalService } from '../../../shared/Swal/swal.service';

@Component({
  selector: 'app-mission-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatAutocomplete,
    MatAutocompleteModule,
  ],
  templateUrl: './mission-details.component.html',
  styleUrl: './mission-details.component.css',
})
export class MissionDetailsComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  employeeCtrl = new FormControl('');
  filteredEmployees: any[] = [];
  selectedEmployees: any[] = [];

  isLoading: boolean = false;
  missionForm!: FormGroup;
  missionData: any = [];
  assignedEmployees: any[] = [];
  temp_emp_ids: any[] = [];
  mission_id: string = '';
  employeesList: any[] = [];
  minEndDate: Date | null = null;


  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(
    private missionsService: MissionsService,
    private employeeService: EmployeesService,
    private router: Router,
    private fb: FormBuilder,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.getAllActiveEmployeesNames();
    const missionId = window.location.pathname.split('/').pop();
    if (missionId) {
      this.initForm();
      this.getMissionDetails(missionId);
    } else {
      console.error('Mission ID not found in the URL');
    }

    this.employeeCtrl.valueChanges.subscribe((value: string | any) => {
      const filterValue = ( typeof value === 'string' ? value : '').toLowerCase();
      this.filteredEmployees = this.employeesList.filter((emp) =>
        (emp.employee_name + ' ' + emp.employee_lastname).toLowerCase().includes(filterValue)
      );
    });

    this.missionForm.get('start_at')?.valueChanges.subscribe((startDate: Date) => {
    this.minEndDate = startDate;

    const endDate = this.missionForm.get('end_at')?.value;
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
        this.missionForm.get('end_at')?.setValue(null);
      }
    });
  }

  initForm() {
    this.missionForm = this.fb.group({
      mission_id: [''],
      mission_name: ['', Validators.required],
      mission_description: ['', Validators.required],
      start_at: ['', Validators.required],
      end_at: [''],
      priority: ['', Validators.required],
      expenses: [0, [Validators.required, Validators.min(0)]],
      employee_id: [],
    });
  }

  getAllActiveEmployeesNames() {
    this.employeeService.getAllActiveEmployeesNames().subscribe((data: any) => {
      this.employeesList = data.data;
    });
  }

  getMissionDetails(missionId: string) {
    this.isLoading = true;
    this.missionsService.getMissionById(missionId).subscribe((response: any) => {
        if (response.success) {
          this.isLoading = false;
          this.missionData = response.data;

          this.assignedEmployees = Array.isArray( this.missionData?.assigned_employees ) ? this.missionData.assigned_employees : [];
          this.assignedEmployees = this.missionData?.assigned_employees;
          this.selectedEmployees = this.missionData?.assigned_employees || [];

          for (let i = 0; i < this.assignedEmployees.length; i++) {
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
            employee_id: this.selectedEmployees.map((emp) => emp.employee_id),
          });

          
        } else {
          this.isLoading = false;
          this.swalService.showError('Mission non trouvée.').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/main-page/missions/missions-list']);
            }
          });
        }
      });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedEmp = event.option.value;
    if (
      !this.selectedEmployees.some(
        (e) => e.employee_id === selectedEmp.employee_id
      )
    ) {
      this.selectedEmployees.push(selectedEmp);
      this.updateEmployeeFormValue();
    }
    this.employeeCtrl.setValue('');
  }

  removeEmployee(emp: any): void {
    this.selectedEmployees = this.selectedEmployees.filter(
      (e) => e.employee_id !== emp.employee_id
    );
    this.updateEmployeeFormValue();
  }

  addEmployeeFromInput(): void {
    this.employeeCtrl.setValue('');
  }
  
  updateEmployeeFormValue(): void {
    const ids = this.selectedEmployees.map((emp) => emp.employee_id);
    this.missionForm.get('employee_id')?.setValue(ids);
  }

  formatDateLocal(dateInput: any): string {
    const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.error('Invalid date input:', dateInput);
      return '';
    }

    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  }

  updateMission() {
    this.isLoading = true;
    
    if (!this.missionForm.valid) {
      this.isLoading = false;
      this.swalService.showWarning('Veuiller controlez vos données.');
      return;
    }

    const formValue = this.missionForm.value;

    const formattedPayload = {
      ...formValue,
      start_at: this.formatDateLocal(formValue.start_at),
      end_at: this.formatDateLocal(formValue.end_at),
    };

    this.missionsService.editMission(this.mission_id, formattedPayload).subscribe((response: any) => {
        if (response.success) {
          this.isLoading = false;
          this.swalService.showSuccess('Mission mise à jour avec succès.').then(() => {
            this.router.navigate(['/main-page/missions/missions-list']);
          });
        } else {
          this.isLoading = false;
          this.swalService.showError('Une erreur s\'est produite lors de la mise à jour de la mission.');
        }
      });
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

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    })
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

        pdf.addImage(
          imgData,
          'JPEG',
          20,
          20,
          pdfImgWidth,
          pdfImgHeight,
          undefined,
          'FAST'
        );

        pdf.save('mission-details.pdf');
      })
      .catch((err) => {
        console.error('Error generating PDF:', err);
      });
  }
}
