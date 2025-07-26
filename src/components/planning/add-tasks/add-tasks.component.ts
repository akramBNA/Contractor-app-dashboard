import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import { TasksService } from '../../../services/tasks.service';
import { SwalService } from '../../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-modal-add-task',
  standalone: true,
 imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    LoadingSpinnerComponent
],  templateUrl: "./add-tasks.component.html",
  styleUrl: './add-tasks.component.css'
})
export class ModalAddTaskComponent {
  taskForm: FormGroup;
  dateError: boolean = false;
  projectId: number;
  isLoading: boolean = false

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

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submit() {
    
    if (this.taskForm.valid) {
      this.isLoading = true
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
        start_date: this.formatDate(start),
        end_date: this.formatDate(end),
      };

      
      this.taskService.addTask(this.data.project_id, taskData).subscribe((data:any)=>{        
        if(data.success){

          this.isLoading = false;
          this.swalService.showSuccess("Tâche ajoutée avec succès.").then(() => {
            this.taskForm.reset();
            this.dialogRef.close(data.data);
          });
        } else {
          this.isLoading = false
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
