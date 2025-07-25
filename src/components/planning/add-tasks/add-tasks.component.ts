import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { TasksService } from '../../../services/tasks.service';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SwalService } from '../../../shared/Swal/swal.service';
@Component({
  selector: 'app-modal-add-task',
  standalone: true,
 imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],  templateUrl: "./add-tasks.component.html",
  styleUrl: './add-tasks.component.css'
})
export class ModalAddTaskComponent {
  taskForm: FormGroup;
  dateError: boolean = false;
  projectId: number;
  // isLoading: boolean = false

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalAddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TasksService,
    private swalService: SwalService
  ) {
    this.projectId = data.projectId;

    this.taskForm = this.fb.group({
      task_name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  submit() {
    if (this.taskForm.valid) {
      const { start_date, end_date } = this.taskForm.value;
      const start = new Date(start_date);
      const end = new Date(end_date);

      if (end < start) {
        this.dateError = true;
        return;
      }

      this.dateError = false;

      const taskData = {
        ...this.taskForm.value,
        project_id: this.projectId
      };

      this.taskService.addTask(this.data.project_id, taskData).subscribe((data:any)=>{
        
        if(data.success){
          this.swalService.showSuccess("Tâche ajoutée avec succès.")
          this.dialogRef.close(data.data);
        } else {
          this.swalService.showError('Erreur lors de l’ajout de la tâche.')
        }
      })
    } else {
      this.swalService.showWarning('Verifiez vos données!')
    }
  }

  close() {
    this.dialogRef.close();
  }
}
