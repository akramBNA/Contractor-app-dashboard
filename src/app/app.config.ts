import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { provideState, provideStore } from '@ngrx/store';
// import { employeesReducer } from '../store/employees/employees.reducers';
// import { EmployeesEffects } from '../store/employees/employees.effects';
import { provideEffects } from '@ngrx/effects';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthInterceptor } from '../interceptors/authentication.interceptor';
import { AuthService } from '../services/authentication.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(MatTableModule, MatPaginatorModule, MatSortModule),
    // provideStore({ employees: employeesReducer }),
    // provideState('employees', employeesReducer),
    // provideEffects(EmployeesEffects),
    importProvidersFrom(MatDatepickerModule, MatNativeDateModule),
  ],
};
