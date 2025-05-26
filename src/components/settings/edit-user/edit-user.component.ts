import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.services';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  isLoading: boolean = false;
  user_id: number = 0;
  user_data: any[] = [];
  roles_data: any[] = [];
  userForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      user_name: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_password: [{ value: '', disabled: true }, [Validators.required]],
      role_id: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.isLoading = true;
    this.getUserData();
  }

  initialFormWithData(userData: any) {
    this.userForm.patchValue({
      user_name: userData.user_name || '',
      user_lastname: userData.user_lastname || '',
      user_email: userData.user_email || '',
      user_password: userData.user_password || '',
      role_id: userData.role_id || '',
    });
  }

  getUserData() {
    this.user_id = Number(this.route.snapshot.paramMap.get('id'));
    this.usersService.getUserById(this.user_id).subscribe((data: any) => {
      if (data.success) {
        this.isLoading = false;
        this.initialFormWithData(data.data);
        this.user_data = data.data;
        this.roles_data = data.roles;
      }
    });
  }

  updateUserData() {
    this.isLoading = true;
    if (this.userForm.invalid) {
      this.isLoading = false;
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires',
        icon: 'error',
      }).then(() => {
        this.isLoading = false;
      });
    };

    this.usersService.updateUser(this.user_id, this.userForm.value).subscribe((data: any) => {
      if( data.success) {
        this.isLoading = false;     
        Swal.fire({
          title: 'Succès',
          text: 'Utilisateur mis à jour avec succès',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/main-page/settings/account-settings']);
        });
      } else {
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          text: 'Failed to update user',
          icon: 'error',
        });
      }
    })
  }

  cancelUpdate() {
    this.router.navigate(['/main-page/settings/account-settings']);
  }
}
