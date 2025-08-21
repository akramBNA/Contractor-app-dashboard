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
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { SwalService } from '../../../shared/Swal/swal.service';
import * as html2pdf from 'html2pdf.js';
// import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from "docx";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  HeightRule,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";

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
    MatAutocompleteModule
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

  exportToDocx() {
    if (!this.missionForm) return;

    const priorityMap: Record<string, string> = {
      LOW: "Faible",
      MEDIUM: "Moyenne",
      HIGH: "Élevée",
      "": "—",
    };

    const today = new Date();
    const todayFormatted = `${String(today.getDate()).padStart(2, "0")} - ${String(
      today.getMonth() + 1
    ).padStart(2, "0")} - ${today.getFullYear()}`;

    const fv = this.missionForm.value;

    const missionId = this.mission_id;
    const missionName = fv.mission_name || "—";
    const missionDesc = fv.mission_description || "—";
    const startDate   = this.formatDateLocal(fv.start_at) || "—";
    const endDate     = this.formatDateLocal(fv.end_at) || "—";
    const priority = priorityMap[fv.priority] || "—";    
    const expenses    = `${fv?.expenses ?? 0} TND`;
    const employees = (this.selectedEmployees || []).map(
      (e: any) => `${e.employee_name} ${e.employee_lastname}`
    );

    const headerCell = (label: string) =>
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: "D9D9D9" },
        margins: { top: 200, bottom: 200, left: 200, right: 200 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true })],
          }),
        ],
      });

    const valueCell = (paragraphs: Paragraph[]) =>
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        margins: { top: 200, bottom: 200, left: 200, right: 200 },
        children: paragraphs,
      });

    const row = (label: string, valueParagraphs: Paragraph[]) =>
      new TableRow({
        height: { value: 700, rule: HeightRule.ATLEAST },
        children: [headerCell(label), valueCell(valueParagraphs)],
      });

    const bulletParagraphs = (items: string[]) =>
      (items.length
        ? items.map(
            (t) =>
              new Paragraph({
                text: t,
                bullet: { level: 0 },
              })
          )
        : [new Paragraph("—")]);

    const rows: TableRow[] = [
      row("Nom de la Mission", [new Paragraph(missionName)]),
      row("Description", [new Paragraph(missionDesc)]),
      row("Date de Début", [new Paragraph(startDate)]),
      row("Date de Fin", [new Paragraph(endDate)]),
      row("Priorité", [new Paragraph(priority)]),
      row("Frais (TND)", [new Paragraph(expenses)]),
      row("Employés Assignés", bulletParagraphs(employees)),
    ];

    const detailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      },
      rows,
    });

    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          height: { value: 1800, rule: HeightRule.ATLEAST },
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "Manager", size: 18 })],
                  alignment: AlignmentType.LEFT,
                }),
                new Paragraph({ text: "", spacing: { before: 1000 } }),
              ],
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "Employé(s) affecté(s)", size: 18 })],
                  alignment: AlignmentType.LEFT,
                }),
                new Paragraph({ text: "", spacing: { before: 1000 } }),
              ],
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
            }),
          ],
        }),
      ],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: todayFormatted,
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph({
              text: `Ordre de Mission N° ${missionId}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "", spacing: { after: 300 } }),
            detailsTable,
            new Paragraph({ text: "", spacing: { after: 800 } }),
            signatureTable,
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Mission_${missionName}.docx`);
    });
  }

}
