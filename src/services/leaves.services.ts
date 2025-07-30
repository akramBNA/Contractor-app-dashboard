import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeavesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllLeaves(): Observable<any> {
      return this.http.get<any>(`${this.base_url}/leaves/getAllLeaves/`);
    };
    requestLeave(leaveData: any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/leaves/requestLeave/`, leaveData);
    };
}
