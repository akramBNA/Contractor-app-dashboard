import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.services';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatSlideToggleModule,
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
})
export class AccountSettingsComponent implements OnInit {
  limit: number = 20;
  offset: number = 0;
  keyword: string = '';

  usersForm: FormGroup;
  roleForm: FormGroup;
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
  stats_data: any = {}

  stats = {
    total: 0,
    users: 0,
    admins: 0,
    super_admins: 0,
  };

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private swalService: SwalService,
    private dialog: MatDialog
  ) {
    this.usersForm = this.fb.group({
      user_name: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required]],
      user_role_id: ['', Validators.required],
    });

    this.roleForm = this.fb.group({
      user_role_id: [3],
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.user_role = sessionStorage.getItem('user_role') || '';

    if (this.user_role === 'super_admin') {
      this.flag = true;
      this.fetchUsers(this.limit, this.offset, this.keyword);

      this.searchControl.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((value: string | null) => {
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
      console.log("data: ", data);
      
      if (data.success) {
        this.users_data = data.data;
        this.roles_data = data.roles;
        this.stats.total = data.total;
        this.stats_data = data.stats;
      } else {
        this.isEmpty = true;
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
          this.swalService
            .showSuccess('Utilisateur ajouté avec succès')
            .then(() => {
              this.usersForm.reset();
            });
        } else {
          this.isLoading = false;
          this.swalService.showError(
            "Erreur lors de l'ajout de l'utilisateur."
          );
        }
      });
    } else {
      this.isLoading = false;
      this.swalService.showWarning(
        'Veuillez remplir tous les champs obligatoires.'
      );
      this.usersForm.markAllAsTouched();
      return;
    }
  }

  onEditUser(userId: any) {
    // this.router.navigate(['/main-page/settings/edit-user', userId]);
    const user = this.users_data.find((u) => u.user_id === userId);
    console.log("user: ", user);
    
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '500x',
      data: {
        user_id: user.user_id,
        current_role: user.user_role_id,
      },
    });

    dialogRef.afterClosed().subscribe((newRoleId: number | undefined) => {
      console.log("userId: ", userId, " -- RID: ", newRoleId);
      
      if (newRoleId && newRoleId !== user.user_role_id) {
        this.updateUserRole(userId, newRoleId);
      }
    });
  }

  onDeleteUser(user_id: any) {
    this.isLoading = false;
    this.swalService
      .showConfirmation('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')
      .then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          this.usersService.deleteUser(user_id).subscribe((data: any) => {
            if (data.success) {
              this.isLoading = false;
              this.swalService
                .showSuccess('Utilisateur supprimé avec succès')
                .then(() => {
                  this.ngOnInit();
                });
            } else {
              this.isLoading = false;
              this.swalService.showError(
                "Erreur lors de la suppression de l'utilisateur."
              );
            }
          });
        }
      });
  }

  updateUserRole(user_id: number, role_id: number) {
    this.isLoading = true;

    this.usersService.updateUserRole(user_id, role_id).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.swalService
            .showSuccess("Rôle de l'utilisateur mis à jour avec succès")
            .then(() => {
              this.ngOnInit();
            });
        } else {
          this.swalService.showError(
            "Erreur lors de la mise à jour du rôle de l'utilisateur."
          );
        }
      },
      (error) => {
        this.isLoading = false;
        this.swalService.showError(
          "Erreur lors de la mise à jour du rôle de l'utilisateur."
        );
      }
    );
  }

  onToggleUserRole(userId: Number, user: any): void {
    const newRoleId = user.user_role_id === 3 ? 2 : 3;

    this.swalService
      .showConfirmation(
        `Êtes-vous sûr de vouloir changer le rôle en ${
          newRoleId === 2 ? 'Admin' : 'Utilisateur'
        } ?`
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.updateUserRole(Number(userId), newRoleId);
        }
      });
  }
}
