import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/input";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-holidays',
  imports: [CommonModule, MatFormField, MatLabel, ReactiveFormsModule],
  templateUrl: './edit-holidays.component.html',
  styleUrl: './edit-holidays.component.css'
})
export class EditHolidaysComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditHolidaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.editForm = this.fb.group({
      holiday_name: [data.holiday.holiday_name, [Validators.required, Validators.minLength(2)]],
      holiday_date: [data.holiday.holiday_date, Validators.required]
    });
  }

  close() {
    this.dialogRef.close(false);
  }

  save() {
    if (this.editForm.invalid) return;

    this.dialogRef.close({
      ...this.editForm.value
    });
  }
}
