import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as EmployeesActions from './employees.actions';
import { EmployeesService } from '../../services/employees.services';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class EmployeesEffects {
  constructor(
    private actions$: Actions,
    private employeesService: EmployeesService
  ) {}

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.getAllEmployees),
      mergeMap(() =>
        this.employeesService.getAllEmployees().pipe(
          map((employees) => EmployeesActions.getAllEmployeesSuccess({ employees })),
          catchError((error) => of(EmployeesActions.getAllEmployeesFailure({ error })))
        )
      )
    )
  );
}
