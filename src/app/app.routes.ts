import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { MainComponentComponent } from '../components/main-component/main-component.component';
import { AccessDeniedComponent } from '../components/access-denied/access-denied.component';
import { AuthGuard } from '../guards/authentication.guards';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main-page', component: MainComponentComponent, canActivate: [AuthGuard] },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', redirectTo: 'access-denied' },
];
