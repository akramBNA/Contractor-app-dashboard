// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import * as EmployeesActions from './employees.actions';
// import { EmployeesService } from '../../services/employees.services';
// import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';

// @Injectable()
// export class EmployeesEffects {
//   constructor(
//     private actions$: Actions,
//     private employeesService: EmployeesService // Ensure proper typing
//   ) {}
  
//   _getAllEmployees = createEffect(() =>
//     this.actions$.pipe(
//       ofType(EmployeesActions.getAllEmployees),
//       exhaustMap((action) =>
//         this.employeesService.getAllEmployees(action.limit, action.offset, action.keyword).pipe(
//           map((data) => {
//             console.log('EMPLOYEES RECEIVED ===>', data);
//             return EmployeesActions.getAllEmployeesSuccess({ employees: data });
//           }),
//           catchError((error) =>
//             of(EmployeesActions.getAllEmployeesFailure({ error }))
//           )
//         )
//       )
//     )
//   );
// }
