import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-tasks.component.html',
  styleUrl:'./add-tasks.component.css'
})
export class AddTaskModalComponent {
  taskForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddTaskModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public projectId: number,
    private taskSevice: TasksService
  ) {
    this.taskForm = this.fb.group({
      task_name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  submit() {
    if (this.taskForm.valid) {
      
      this.dialogRef.close({ ...this.taskForm.value, project_id: this.projectId });
    }
  }

  close() {
    this.dialogRef.close();
  }
}