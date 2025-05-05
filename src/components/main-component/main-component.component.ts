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

  constructor(private authService: AuthService) {}

  toggleRHSubmenu() {
    this.showRHSubmenu = !this.showRHSubmenu;
  }

  logout(): void {
    if (this.authService) {
      this.authService.logout();
    }
  }
}
