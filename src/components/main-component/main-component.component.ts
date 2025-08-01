import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'app-main-component',
  imports: [RouterOutlet, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.css',
})
export class MainComponentComponent {
  current_year: number = new Date().getFullYear();
  my_web_resume_link: string = 'https://akrambna.github.io/My-Web-Resume/';
  showRHSubmenu: boolean = false;
  showPlanningSubmenu: boolean = false;
  showSettingsSubmenu: boolean = false;
  showMissionsSubmenu: boolean = false;

  showSttingsMenu: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userRole = sessionStorage.getItem('user_role');
    if (userRole === 'super_admin') {
      this.showSttingsMenu = true;
    }
  }

  toggleRHSubmenu() {
    this.showRHSubmenu = !this.showRHSubmenu;
  }

  togglePlanningSubmenu() {
    this.showPlanningSubmenu = !this.showPlanningSubmenu;
  }

  toggleSettingsSubmenu() {
    this.showSettingsSubmenu = !this.showSettingsSubmenu;
  }

  toggleMissionsSubmenu(): void {
    this.showMissionsSubmenu = !this.showMissionsSubmenu;
  }

  logout(): void {
    if (this.authService) {
      this.authService.logout();
    }
  }
}
