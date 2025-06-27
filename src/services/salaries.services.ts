import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SalariesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllSalaries(): Observable<any> {
      return this.http.get<any>(`${this.base_url}/salaries/getAllSalaries/`);
    };
  
}