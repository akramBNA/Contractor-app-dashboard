import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.base_url}/employees/getEmployeeById/${id}`);
  }

  getJobsAndContractTypes(): Observable<any> {
    return this.http.get<any>(`${this.base_url}/employees/getJobsAndContractTypes/`);
  }

  updateEmployee(id: number, employee_data: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.base_url}/employees/editEmployee/${id}`, employee_data);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base_url}/employees/deleteEmployee/${id}`);
  }

  getAllActiveEmployeesNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base_url}/employees/getAllActiveEmployeesNames/`);
  }
}
