import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.services';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, LoadingSpinnerComponent, ReactiveFormsModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
})
export class AccountSettingsComponent implements OnInit {
  usersForm: FormGroup;
  roles_data: any[] = [];
  users_data: any[] = [];
  isLoading: boolean = false;
  user_role: string = '';
  flag: boolean = false;

  constructor(
    private usersService: UsersService, 
    private fb: FormBuilder,
    private router: Router,
    private swalService: SwalService) 
  {
    this.usersForm = this.fb.group({
      user_name: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required]],
      user_role_id: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.user_role = sessionStorage.getItem('user_role') || '';

    if (this.user_role === 'super_admin') {
      this.flag = true;
      this.usersService.getAllUsers().subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.users_data = data.data;
          this.roles_data = data.roles;
        }
      });
    } else {
      this.isLoading = false;
      this.flag = false;
    }
  }

  onAddUser() {
    this.isLoading = true;
    
    if (this.usersForm.valid) {
      this.usersService.addUser(this.usersForm.value).subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.swalService.showSuccess('Utilisateur ajouté avec succès').then(() => {
            this.usersForm.reset();
          });
        } else {
          this.isLoading = false;
          this.swalService.showError('Erreur lors de l\'ajout de l\'utilisateur.');
        }
      });
    } else {
      this.isLoading = false;
      this.swalService.showWarning('Veuillez remplir tous les champs obligatoires.');
      this.usersForm.markAllAsTouched();
      return;
    }
  }

  onEditUser(userId: any) {
    this.router.navigate(['/main-page/settings/edit-user', userId]);
  }

  onDeleteUser(user_id: any) {
    this.isLoading = false;
    this.swalService.showConfirmation('Êtes-vous sûr de vouloir supprimer cet utilisateur ?').then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.usersService.deleteUser(user_id).subscribe((data: any) => {
          if (data.success) {
            this.isLoading = false;
            this.swalService.showSuccess('Utilisateur supprimé avec succès').then(() => {
              this.ngOnInit();
            });
          } else {
            this.isLoading = false;
            this.swalService.showError('Erreur lors de la suppression de l\'utilisateur.');
          }
        });
      }
    });
  }
}
