import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipGrid, MatChipInputEvent, MatChipRow, MatChipsModule } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../services/projects.services';
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
    MatIconModule,
    MatChipGrid,
    MatChipRow,
    MatAutocomplete,
    MatAutocompleteModule,
    MatChipsModule
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AddProjectComponent {
  
  employeeCtrl = new FormControl('');
  projectForm: FormGroup;
  isLoading: boolean = false;
  formSubmitted: boolean = false;
  employeesList: any[] = [];
  filteredEmployees: any[] = [];
  separatorKeysCodes: any;
  selectedEmployees: any[] = [];



  constructor(
    private projectService: ProjectsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private swalService: SwalService,
    private employeesService: EmployeesService
  ) {
      this.projectForm = this.formBuilder.group(
        {
          project_name: ['', Validators.required],
          description: ['', Validators.required],
          employee_id: [[], Validators.required],
          start_date: ['', Validators.required],
          end_date: ['', Validators.required],
          priority: ['', Validators.required],
          status: ['', Validators.required],
        },
        {
          validators: [this.endDateAfterStartDateValidator()]
        }
      );
  }


  ngOnInit() {
    this.getAllActiveEmployeesNames();

    this.employeeCtrl.valueChanges.subscribe(value => {
      const search = value?.toLowerCase?.() || '';
      this.filteredEmployees = this.employeesList.filter(emp =>
        `${emp.employee_name} ${emp.employee_lastname}`.toLowerCase().includes(search)
      );
    });
  }

  getAllActiveEmployeesNames() {
    this.employeesService.getAllActiveEmployeesNames().subscribe((data: any) => {
     if(data.success) {
        this.employeesList = data.data
      }
    })
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedEmp = event.option.value;
    const alreadySelected = this.selectedEmployees.some(emp => emp.employee_id === selectedEmp.employee_id);
    if (!alreadySelected) {
      this.selectedEmployees.push(selectedEmp);
      this.updateEmployeeFormValue();
    }
    this.employeeCtrl.setValue('');
  }

  addEmployeeFromInput(event: MatChipInputEvent): void {
    this.employeeCtrl.setValue('');
  }

  updateEmployeeFormValue(): void {
    const ids = this.selectedEmployees.map(emp => emp.employee_id);
    this.projectForm.get('employee_id')?.setValue(ids);
  }

  removeEmployee(emp: any): void {
    this.selectedEmployees = this.selectedEmployees.filter(e => e.employee_id !== emp.employee_id);
    this.updateEmployeeFormValue();
  }

  endDateAfterStartDateValidator() {
    return (formGroup: FormGroup) => {
      const startDate = formGroup.get('start_date')?.value;
      const endDate = formGroup.get('end_date')?.value;

      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        formGroup.get('end_date')?.setErrors({ endBeforeStart: true });
      } else {
        const errors = formGroup.get('end_date')?.errors;
        if (errors) {
          delete errors['endBeforeStart'];
          if (Object.keys(errors).length === 0) {
            formGroup.get('end_date')?.setErrors(null);
          } else {
            formGroup.get('end_date')?.setErrors(errors);
          }
        }
      }
    };
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
