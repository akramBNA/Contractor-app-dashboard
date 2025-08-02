import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { MainComponentComponent } from '../components/main-component/main-component.component';
import { AccessDeniedComponent } from '../components/access-denied/access-denied.component';
import { AuthGuard } from '../guards/authentication.guards';
import { AddEmployeeComponent } from '../components/hr/add-employee/add-employee.component';
import { EmployeeListComponent } from '../components/hr/employee-list/employee-list.component';
import { HrStatsComponent } from '../components/hr/hr-stats/hr-stats.component';
import { EditEmployeeComponent } from '../components/hr/edit-employee/edit-employee.component';
import { MaterialsComponent } from '../components/materials/materials/materials.component';
import { MissionsListComponent } from '../components/missions/missions-list/missions-list.component';
import { AddProjectComponent } from '../components/planning/add-project/add-project.component';
import { ShowProjectsComponent } from '../components/planning/show-projects/show-projects.component';
import { ViewProjectComponent } from '../components/planning/view-project/view-project.component';
import { AccountSettingsComponent } from '../components/settings/account-settings/account-settings.component';
import { CompanySettingsComponent } from '../components/settings/company-settings/company-settings.component';
import { ContractsSettingsComponent } from '../components/settings/contracts-settings/contracts-settings.component';
import { HrSettingsComponent } from '../components/settings/hr-settings/hr-settings.component';
import { EditUserComponent } from '../components/settings/edit-user/edit-user.component';
import { AddMissionsComponent } from '../components/missions/add-missions/add-missions.component';
import { MissionDetailsComponent } from '../components/missions/mission-details/mission-details.component';
import { SalariesComponent } from '../components/hr/salaries/salaries.component';
import { AddUserComponent } from '../components/settings/add-user/add-user.component';
import { RequestLeavesComponent } from '../components/hr/leaves/request-leaves/request-leaves/request-leaves.component';
import { HolidaysListComponent } from '../components/settings/holidays-list/holidays-list.component';
import { LeavesListComponent } from '../components/hr/leaves/leaves-list/leaves-list.component';
import { SignupComponent } from '../components/signup/signup.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  {
    path: 'main-page',
    component: MainComponentComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'hr',
        children: [
          { path: 'add-employee', component: AddEmployeeComponent },
          { path: 'employees-list', component: EmployeeListComponent },
          { path: 'hr-stats', component: HrStatsComponent },
          { path: 'edit-employee/:id', component: EditEmployeeComponent },
          { path: 'request-leaves', component: RequestLeavesComponent },
          { path: 'leaves-list', component: LeavesListComponent },
          { path: 'salaries', component: SalariesComponent },
        ],
      },
      {
        path: 'planning',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
          { path: 'add-project', component: AddProjectComponent },
          { path: 'show-project', component: ShowProjectsComponent },
          { path: 'view-project/:id', component: ViewProjectComponent },
        ],
      },
      { path: 'material', component: MaterialsComponent },
      {
        path: 'missions',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
          { path: 'missions-list', component: MissionsListComponent },
          { path: 'add-mission', component: AddMissionsComponent },
          { path: 'mission-details/:id', component: MissionDetailsComponent },
        ],
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
          { path: 'account-settings', component: AccountSettingsComponent },
          { path: 'company-settings', component: CompanySettingsComponent },
          { path: 'contracts-settings', component: ContractsSettingsComponent },
          { path: 'hr-settings', component: HrSettingsComponent },
          { path: 'edit-user/:id', component: EditUserComponent },
          { path: 'add-user', component: AddUserComponent },
          { path: 'holidays-list', component: HolidaysListComponent}
        ],
      },
    ],
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', redirectTo: 'access-denied' },
];
