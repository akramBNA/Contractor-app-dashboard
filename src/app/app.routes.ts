import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { MainComponentComponent } from '../components/main-component/main-component.component';
import { AccessDeniedComponent } from '../components/access-denied/access-denied.component';
import { AuthGuard } from '../guards/authentication.guards';
import { AddEmployeeComponent } from '../components/hr/add-employee/add-employee.component';
import { EmployeeListComponent } from '../components/hr/employee-list/employee-list.component';
import { HrStatsComponent } from '../components/hr/hr-stats/hr-stats.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
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
        ],
      },
    ],
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', redirectTo: 'access-denied' },
];
