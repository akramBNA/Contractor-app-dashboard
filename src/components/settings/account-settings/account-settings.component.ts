import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.services';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
})
export class AccountSettingsComponent implements OnInit {
  users_data: any[] = [];
  isLoading: boolean = false;
  user_role: string = '';
  flag: boolean = false;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.user_role = sessionStorage.getItem('user_role') || '';

    if (this.user_role === 'super_admin') {
      this.flag = true;
      this.usersService.getAllUsers().subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.users_data = data.data;
        }
      });
    } else {
      this.isLoading = false;
      this.flag = false;
    }
  }

  onEditUser(user: any) {}

  onDeleteUser(user: any) {}
}
