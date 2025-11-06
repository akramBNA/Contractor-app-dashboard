import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getCompanyInformations(): Observable<any> {
      return this.http.get<any>(`${this.base_url}/company/getCompanyInformations/`);
    };

    updateCompany(data: any): Observable<any> {
      return this.http.put<any>(`${this.base_url}/company/updateCompanyInformations/`, data);
    };
}
