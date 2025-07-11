import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { provideState, provideStore } from '@ngrx/store';
// import { employeesReducer } from '../store/employees/employees.reducers';
// import { EmployeesEffects } from '../store/employees/employees.effects';
import { provideEffects } from '@ngrx/effects';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(MatTableModule, MatPaginatorModule, MatSortModule),
    // provideStore({ employees: employeesReducer }),
    // provideState('employees', employeesReducer),
    // provideEffects(EmployeesEffects),
    importProvidersFrom(MatDatepickerModule, MatNativeDateModule ),
  ],
};
