// import { createReducer, on } from '@ngrx/store';
// import * as EmployeesActions from './employees.actions';
// import { Employee } from './employees.models';

// export interface EmployeesState {
//   employees: Employee[];
//   loading: boolean;
//   error: any;
// }

// export const initialState: EmployeesState = {
//   employees: [],
//   loading: false,
//   error: null
// };

// export const employeesReducer = createReducer(
//   initialState,
//   on(EmployeesActions.getAllEmployees, (state) => ({
//     ...state,
//     loading: true
//   })),
//   on(EmployeesActions.getAllEmployeesSuccess, (state, { employees }) => ({
//     ...state,
//     loading: false,
//     employees
//   })),
//   on(EmployeesActions.getAllEmployeesFailure, (state, { error }) => ({
//     ...state,
//     loading: false,
//     error
//   }))
// );
