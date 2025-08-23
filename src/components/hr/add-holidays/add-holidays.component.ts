import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { HolidaysService } from '../../../services/holidays.service';
import { SwalService } from '../../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-add-holidays',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    LoadingSpinnerComponent
],
  templateUrl: './add-holidays.component.html',
  styleUrl: './add-holidays.component.css'
})
export class AddHolidaysComponent {
  holidayForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddHolidaysComponent>,
    private holidaysService: HolidaysService,
    private swalService: SwalService
  ) {
    this.holidayForm = this.fb.group({
      holiday_name: ['', Validators.required],
      holiday_date: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.isLoading = true;    
    if (!this.holidayForm.valid) {
      this.isLoading = false;
      this.swalService.showWarning("S'il vous plaît, remplissez tous les champs requis.");
    }

    const rawDate = this.holidayForm.value.holiday_date;
    const formattedDate = new Intl.DateTimeFormat('fr-CA').format(rawDate);

    const holidayData = {
      holiday_name: this.holidayForm.value.holiday_name,
      holiday_date: formattedDate
    };
    
    this.holidaysService.addHoliday(holidayData).subscribe((data: any) => {      
      if (data.success) {
        this.isLoading = false;
        this.swalService.showSuccess('Jour férié ajouté avec succès.');
        this.dialogRef.close(true);
      } else {
        this.isLoading = false;
        this.swalService.showError('Erreur lors de l\'ajout du jour férié.');
      }
    }, (error) => {
      this.isLoading = false;
      this.swalService.showError('Erreur de connexion. Veuillez réessayer plus tard.');
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
