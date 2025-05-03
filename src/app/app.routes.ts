import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { MainComponentComponent } from '../components/main-component/main-component.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main-page', component: MainComponentComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
