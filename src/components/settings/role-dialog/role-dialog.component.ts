import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../../services/users.services';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatButtonModule],
  templateUrl: './role-dialog.component.html',
})
export class RoleDialogComponent {
  roleForm: FormGroup;
  roles = [
    { label: 'Super Admin', id: 1 },
    { label: 'Admin', id: 2 },
    { label: 'Utilisateur', id: 3 },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user_id: number; current_role: number },
    private userService: UsersService
  ) {
    this.roleForm = this.fb.group({
      user_role_id: [data.current_role, Validators.required],
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.dialogRef.close(this.roleForm.value.user_role_id);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
