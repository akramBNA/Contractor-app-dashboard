import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-holidays',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-holidays.component.html',
  styleUrl: './edit-holidays.component.css'
})
export class EditHolidaysComponent {

  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditHolidaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {    

    this.editForm = this.fb.group({
      holiday_name: [data.holiday.holiday_name, Validators.required],
      holiday_date: [data.holiday.holiday_date.substring(0,10), Validators.required]
    });
  }

  close() {
    this.dialogRef.close(false);
  }

  save() {
    if (this.editForm.invalid) return;
    this.dialogRef.close(this.editForm.value);
  }
}
