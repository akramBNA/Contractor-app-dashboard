import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Employee } from '../store/employees/employees.models';
import { Employee } from '../models/employees.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

  getAllEmployees(limit: number, offset: number, keyword?: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.base_url}/employees/getAllEmployees/?limit=${limit}&offset=${offset}&keyword=${keyword}`);
  }

  addOneEmployee(employee_data: any): Observable<Employee> {
    return this.http.post<Employee>(`${this.base_url}/employees/addOneEmployee/`, employee_data);
  }
}
