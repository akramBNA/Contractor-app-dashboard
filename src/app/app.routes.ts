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
import { MissionsComponent } from '../components/missions/missions/missions.component';
import { AddProjectComponent } from '../components/planning/add-project/add-project.component';
import { ShowProjectsComponent } from '../components/planning/show-projects/show-projects.component';

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
          { path: 'edit-employee/:id', component: EditEmployeeComponent },
        ],
      },
      {
        path: 'planning',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
          { path: 'add-project', component: AddProjectComponent },
          { path: 'show-project', component: ShowProjectsComponent },
        ],
      },
      { path: 'material', component: MaterialsComponent },
      { path: 'missions', component: MissionsComponent },
    ],
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', redirectTo: 'access-denied' },
];
