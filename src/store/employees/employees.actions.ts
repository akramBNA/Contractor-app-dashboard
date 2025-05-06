import { createAction, props } from '@ngrx/store';
import { Employee } from './employees.models';

export const getAllEmployees = createAction('[Employees] Get All Employees');

export const getAllEmployeesSuccess = createAction(
  '[Employees] Load Employees Success',
  props<{ employees: Employee[] }>()
);

export const getAllEmployeesFailure = createAction(
  '[Employees] Load Employees Failure',
  props<{ error: any }>()
);
