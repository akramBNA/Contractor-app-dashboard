import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeesState } from './employees.reducers';

export const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');

export const selectAllEmployees = createSelector(
  selectEmployeesState,
  (state) => state.employees
);

export const selectEmployeesLoading = createSelector(
  selectEmployeesState,
  (state) => state.loading
);

export const selectEmployeesError = createSelector(
  selectEmployeesState,
  (state) => state.error
);
