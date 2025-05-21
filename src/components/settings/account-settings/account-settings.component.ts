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

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getAllUsers().subscribe((data: any) => {
      if (data.success) {
        this.isLoading = false;
        this.users_data = data.data;
      }
    });
  }

  onEditUser(user: any) {}

  onDeleteUser(user: any) {}
}
