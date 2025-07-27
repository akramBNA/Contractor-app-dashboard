import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.services';
import { SwalService } from '../../../shared/Swal/swal.service';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-add-user',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule, LoadingSpinnerComponent, MatInputModule, MatSelectModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  roles_data: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private swalService: SwalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      user_name: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_role_id: ['', Validators.required],
    });

    this.fetchRoles();
  }

  fetchRoles() {
    this.usersService.getAllUsers().subscribe((data: any) => {
      if (data.success) {
        this.roles_data = data.roles;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.usersService.addUser(this.userForm.value).subscribe((res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.swalService.showSuccess('Utilisateur ajouté avec succès').then(() => {
            this.router.navigate(['/main-page/settings/account-settings']);
          });
        } else {
          this.swalService.showError('Erreur lors de l\'ajout');
        }
      });
    } else {
      this.userForm.markAllAsTouched();
      this.swalService.showWarning('Veuillez corriger les erreurs du formulaire.');
    }
  }

  goBack(): void {
    this.router.navigate(['/main-page/settings/account-settings']);
  }
}
