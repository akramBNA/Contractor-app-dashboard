import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { SocketService } from '../../services/socket.services';


@Component({
  selector: 'app-main-component',
  imports: [RouterOutlet, RouterLink, CommonModule, MatIconModule, MatBadgeModule, MatMenuModule],
  standalone: true,
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.css'],
})
export class MainComponentComponent {
  current_year: number = new Date().getFullYear();
  my_web_resume_link: string = 'https://akram-benaoun.site/';
  showRHSubmenu: boolean = false;
  showPlanningSubmenu: boolean = false;
  showSettingsSubmenu: boolean = false;
  showMissionsSubmenu: boolean = false;
  showMaterialsSubmenu: boolean = false;

  showSttingsMenu: boolean = false;
  showPlanningMenu: boolean = false;
  showMissionsMenu: boolean = false;
  showMaterialMenu: boolean = false;

  showEmployeeListMenu: boolean = true;
  showAddEmployeeMenu: boolean = true;
  showRequestLeavesMenu: boolean = true;
  showLeavesListMenu: boolean = true;
  showMyLeavesMenu: boolean = true;
  showSalariesMenu: boolean = true;
  showStatsMenu: boolean = true;
  showHolidaysMenu: boolean = true;

  showNotificationsDropdown = false;

  user_name: string = '';
  notificationsCount = 0;
  notificationsList: any[] = [];

  badgePulse = false;

  private clickListener!: (event: any) => void;

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
  ) {}

  ngOnInit() {
    const userId = parseInt(sessionStorage.getItem('user_id') || '0', 10);
    const userRole = sessionStorage.getItem('user_role') ?? '';
    this.user_name = sessionStorage.getItem('user_name') ?? '';

    this.socketService.register(userId, userRole);

    this.socketService.onNewNotification((notif: any) => {
      this.notificationsList.unshift(notif);
      if (!this.showNotificationsDropdown) {
        this.notificationsCount++;
        this.badgePulse = false;
        setTimeout(() => this.badgePulse = true, 10);
        setTimeout(() => this.badgePulse = false, 700);
      }
      console.log('🔔 New notification:', notif);
    });

    if (userRole === 'super_admin' || userRole === 'admin') {
      this.showSttingsMenu = true;
      this.showPlanningMenu = true;
      this.showMissionsMenu = true;
      this.showMaterialMenu = true;

      this.showEmployeeListMenu = true;
      this.showAddEmployeeMenu = true;
      this.showRequestLeavesMenu = true;
      this.showLeavesListMenu = true;
      this.showMyLeavesMenu = true;
      this.showSalariesMenu = true;
      this.showStatsMenu = true;
      this.showHolidaysMenu = true;
    }

    if (userRole === 'user') {
      this.showEmployeeListMenu = false;
      this.showAddEmployeeMenu = false;
      this.showRequestLeavesMenu = true;
      this.showMyLeavesMenu=true;
      this.showLeavesListMenu = false;
      this.showSalariesMenu = false;
      this.showStatsMenu = false;
      this.showHolidaysMenu = true;
    }
  };

  toggleRHSubmenu() {
    this.showRHSubmenu = !this.showRHSubmenu;
  };

  togglePlanningSubmenu() {
    this.showPlanningSubmenu = !this.showPlanningSubmenu;
  };

  toggleSettingsSubmenu() {
    this.showSettingsSubmenu = !this.showSettingsSubmenu;
  };

  toggleMissionsSubmenu(): void {
    this.showMissionsSubmenu = !this.showMissionsSubmenu;
  };

  toggleMaterialsSubmenu(): void {
    this.showMaterialsSubmenu = !this.showMaterialsSubmenu;
  };

  logout(): void {
    if (this.authService) {
      this.authService.logout();
    }
  };

  openNotifications() {
    this.notificationsCount = 0;
    console.table(this.notificationsList);
  };

  toggleNotifications() {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    if (this.showNotificationsDropdown) {
      this.notificationsCount = 0;
    }
  };

  clearNotifications(event: Event) {
    event.stopPropagation();
    this.notificationsList = [];
    this.notificationsCount = 0;
  };

  ngAfterViewInit() {
    this.clickListener = (event: any) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sidebar') && !target.closest('.notif-dropdown')) {
        this.showNotificationsDropdown = false;
      }
    };
    document.addEventListener('click', this.clickListener);
  };

  ngOnDestroy() {
    document.removeEventListener('click', this.clickListener);
  };

  trackByNotifId(index: number, notif: any) {
    return notif.id || index;
  };

}
