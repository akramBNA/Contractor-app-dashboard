import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.services';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginatorModule } from "@angular/material/paginator";



@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, LoadingSpinnerComponent, ReactiveFormsModule, RouterLink, MatInputModule, MatPaginatorModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
})
export class AccountSettingsComponent implements OnInit {
  limit: number = 20;
  offset: number = 0;
  keyword: string = '';

  usersForm: FormGroup;
  roles_data: any[] = [];
  users_data: any[] = [];
  isLoading: boolean = false;
  user_role: string = '';
  flag: boolean = false;
  searchControl = new FormControl('');
  isEmpty: boolean = false;


  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];
  pageSize = 5;
  currentPage = 0;
  searchText = '';

  stats = {
    total: 0,
    users: 0,
    admins: 0,
    super_admins: 0
  };

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
      this.fetchUsers(this.limit, this.offset, this.keyword);

      this.searchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value: string | null) => {
          this.keyword = value?.trim() || '';
          this.offset = 0;
          this.fetchUsers(this.limit, this.offset, this.keyword);
        });
    } else {
      this.isLoading = false;
      this.flag = false;
    }
  }

  fetchUsers(lim: number, off: number, key: string) {
    this.isEmpty = false;
    this.isLoading = true;
    this.usersService.getAllUsers(lim, off, key).subscribe((data: any) => {
      this.isLoading = false;
      if (data.success) {
        if(data.data.length === 0) {
          this.isEmpty = true;
          this.users_data = [];
        };
        this.users_data = data.data;
        this.roles_data = data.roles;
        this.stats.total = data.total;
      } else {
        this.users_data = [];
      }
    });
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.fetchUsers(this.limit, this.offset, this.keyword);
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
