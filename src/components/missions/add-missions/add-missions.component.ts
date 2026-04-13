import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { EmployeesService } from '../../../services/employees.services';
import { MissionsService } from '../../../services/missions.services';
import { SwalService } from '../../../shared/Swal/swal.service';
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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

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
    MatAutocomplete,
    MatAutocompleteModule,
    MatDialogModule
],
  templateUrl: './add-missions.component.html',
  styleUrls: ['./add-missions.component.css'],
})
export class AddMissionsComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  employeeCtrl = new FormControl('');
  selectedEmployees: any[] = [];
  filteredEmployees: any[] = [];

  missionForm: FormGroup;
  isLoading = false;
  employeesList: any[] = [];
  minStartDate: Date = new Date();
  minEndDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private missionService: MissionsService,
    private employeeService: EmployeesService,
    private router: Router,
    private swalService: SwalService,
    private dialogRef: MatDialogRef<AddMissionsComponent>,
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
    const today = new Date();
    this.minStartDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    this.getAllActiveEmployeesNames();

    this.employeeCtrl.valueChanges.subscribe((value) => {
      const filterValue = value?.toLowerCase?.() || '';
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

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    const today = new Date();
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return date >= normalizedToday;
  };

  getAllActiveEmployeesNames() {
    this.employeeService.getAllActiveEmployeesNames().subscribe((data: any) => {
      this.employeesList = data.data;
      this.filteredEmployees = [...this.employeesList];
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

  addEmployeeFromInput(event: MatChipInputEvent): void {
    this.employeeCtrl.setValue('');
  }

  updateEmployeeFormValue(): void {
    const ids = this.selectedEmployees.map((emp) => emp.employee_id);
    this.missionForm.get('employee_id')?.setValue(ids);
  }

  formatDate(date: any): string | null {
    if (!date) return null;

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onSubmitMission() {
    this.isLoading = true;
    const formData = {
      ...this.missionForm.value,
      start_at: this.formatDate(this.missionForm.value.start_at),
      end_at: this.formatDate(this.missionForm.value.end_at),
    };

    if (!this.missionForm.valid) {
      this.isLoading = false;
      this.swalService.showWarning(
        'Veuillez remplir tous les champs obligatoires.',
      );
      return;
    }

    this.missionService.addMission(formData).subscribe((data: any) => {
      if (data.success) {
        this.isLoading = false;
        this.swalService.showSuccess('Mission ajoutée avec succès').then(() => {
          this.missionForm.reset();
          this.selectedEmployees = [];
          this.router.navigate(['/main-page/missions/missions-list']);
          this.dialogRef.close('refresh');
        });
      } else {
        this.isLoading = false;
        this.swalService
          .showError("Une erreur s'est produite lors de l'ajout de la mission.")
          .then(() => {
            this.router.navigate(['/main-page/missions/missions-list']);
          });
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
