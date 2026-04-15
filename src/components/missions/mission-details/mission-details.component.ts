import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MissionsService } from '../../../services/missions.services';
import { EmployeesService } from '../../../services/employees.services';
import { CommonModule } from '@angular/common';
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
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { SwalService } from '../../../shared/Swal/swal.service';
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
} from 'docx';
import { saveAs } from 'file-saver';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';

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
    MatDialogModule,
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
  minStartDate: Date | null = null;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(
    private missionsService: MissionsService,
    private employeeService: EmployeesService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private dialogRef: MatDialogRef<MissionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { missionId: string },
  ) {}

  ngOnInit() {
    this.getAllActiveEmployeesNames();
    this.initForm();

    const missionId = this.data?.missionId;

    if (missionId) {
      this.getMissionDetails(missionId);
    } else {
      console.error('Mission ID not provided to dialog');
    }

    this.employeeCtrl.valueChanges.subscribe((value: string | any) => {
      const filterValue = (
        typeof value === 'string' ? value : ''
      ).toLowerCase();

      this.filteredEmployees = this.employeesList.filter((emp) =>
        (emp.employee_name + ' ' + emp.employee_lastname)
          .toLowerCase()
          .includes(filterValue),
      );
    });

    this.missionForm
      .get('start_at')
      ?.valueChanges.subscribe((startDate: Date) => {
        if (!startDate) return;

        const normalizedStart = new Date(startDate);
        normalizedStart.setHours(0, 0, 0, 0);

        this.minEndDate = normalizedStart;

        const endDate = this.missionForm.get('end_at')?.value;

        if (endDate) {
          const normalizedEnd = new Date(endDate);
          normalizedEnd.setHours(0, 0, 0, 0);

          if (normalizedEnd < normalizedStart) {
            this.missionForm.get('end_at')?.setValue(null);
          }
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

    this.missionsService
      .getMissionById(missionId)
      .subscribe((response: any) => {
        this.isLoading = false;

        if (!response.success) {
          this.swalService.showError('Mission non trouvée.').then(() => {
            this.dialogRef.close();
          });
          return;
        }

        this.missionData = response.data;

        this.selectedEmployees = this.missionData?.assigned_employees || [];

        this.temp_emp_ids = this.selectedEmployees.map(
          (emp: any) => emp.employee_id,
        );

        this.mission_id = this.missionData.mission_id;

        this.missionForm.patchValue({
          mission_name: this.missionData.mission_name,
          mission_description: this.missionData.mission_description,
          start_at: this.missionData.start_at,
          end_at: this.missionData.end_at,
          priority: this.missionData.priority,
          expenses: this.missionData.expenses,
          employee_id: this.selectedEmployees.map(
            (emp: any) => emp.employee_id,
          ),
        });

        if (this.missionData.start_at) {
          const startDate = new Date(this.missionData.start_at);
          startDate.setHours(0, 0, 0, 0);
          this.minEndDate = startDate;
        }
      });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedEmp = event.option.value;

    if (
      !this.selectedEmployees.some(
        (e) => e.employee_id === selectedEmp.employee_id,
      )
    ) {
      this.selectedEmployees.push(selectedEmp);
      this.updateEmployeeFormValue();
    }

    this.employeeCtrl.setValue('');
  }

  removeEmployee(emp: any): void {
    this.selectedEmployees = this.selectedEmployees.filter(
      (e) => e.employee_id !== emp.employee_id,
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
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  }

  updateMission() {
    this.isLoading = true;

    if (!this.missionForm.valid) {
      this.isLoading = false;
      this.swalService.showWarning('Veuillez contrôler vos données.');
      return;
    }

    const formValue = this.missionForm.value;

    const payload = {
      ...formValue,
      start_at: this.formatDateLocal(formValue.start_at),
      end_at: this.formatDateLocal(formValue.end_at),
    };

    this.missionsService
      .editMission(this.mission_id, payload)
      .subscribe((response: any) => {
        this.isLoading = false;

        if (response.success) {
          this.swalService
            .showSuccess('Mission mise à jour avec succès.')
            .then(() => this.dialogRef.close('refresh'));
        } else {
          this.swalService.showError(
            "Une erreur s'est produite lors de la mise à jour.",
          );
        }
      });
  }

  goBack() {
    this.dialogRef.close();
  }

  exportToDocx() {
    if (!this.missionForm) return;

    const priorityMap: Record<string, string> = {
      LOW: 'Faible',
      MEDIUM: 'Moyenne',
      HIGH: 'Élevée',
      '': '—',
    };

    const today = new Date();
    const todayFormatted = `${String(today.getDate()).padStart(2, '0')} - ${String(
      today.getMonth() + 1,
    ).padStart(2, '0')} - ${today.getFullYear()}`;

    const fv = this.missionForm.value;

    const missionId = this.mission_id;
    const missionName = fv.mission_name || '—';
    const missionDesc = fv.mission_description || '—';
    const startDate = this.formatDateLocal(fv.start_at) || '—';
    const endDate = this.formatDateLocal(fv.end_at) || '—';
    const priority = priorityMap[fv.priority] || '—';
    const expenses = `${fv?.expenses ?? 0} TND`;
    const employees = (this.selectedEmployees || []).map(
      (e: any) => `${e.employee_name} ${e.employee_lastname}`,
    );

    const headerCell = (label: string) =>
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'D9D9D9' },
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
      items.length
        ? items.map(
            (t) =>
              new Paragraph({
                text: t,
                bullet: { level: 0 },
              }),
          )
        : [new Paragraph('—')];

    const rows: TableRow[] = [
      row('Nom de la Mission', [new Paragraph(missionName)]),
      row('Description', [new Paragraph(missionDesc)]),
      row('Date de Début', [new Paragraph(startDate)]),
      row('Date de Fin', [new Paragraph(endDate)]),
      row('Priorité', [new Paragraph(priority)]),
      row('Frais (TND)', [new Paragraph(expenses)]),
      row('Employés Assignés', bulletParagraphs(employees)),
    ];

    const detailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
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
                  children: [new TextRun({ text: 'Manager', size: 18 })],
                  alignment: AlignmentType.LEFT,
                }),
                new Paragraph({ text: '', spacing: { before: 1000 } }),
              ],
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Employé(s) affecté(s)', size: 18 }),
                  ],
                  alignment: AlignmentType.LEFT,
                }),
                new Paragraph({ text: '', spacing: { before: 1000 } }),
              ],
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
            }),
          ],
        }),
      ],
    });

    const headerTable = new Table({
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
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: 'center',
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'SOHABA', bold: true, size: 28 }),
                  ],
                  alignment: AlignmentType.LEFT,
                }),
              ],
            }),

            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: 'center',
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: todayFormatted, bold: true, size: 28 }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            headerTable,

            new Paragraph({ text: '', spacing: { after: 300 } }),

            new Paragraph({
              text: `Ordre de Mission N° ${missionId}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({ text: '', spacing: { after: 300 } }),

            detailsTable,
            new Paragraph({ text: '', spacing: { after: 800 } }),
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
