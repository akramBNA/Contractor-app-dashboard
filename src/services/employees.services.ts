import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../store/employees/employees.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  constructor(private http: HttpClient) {}

    readonly base_url = environment.backendURL;

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.base_url}/employees/getAllEmployees/`);
  }
}
