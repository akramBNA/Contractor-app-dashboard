import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeavesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllLeaves(limit: number, offset: number): Observable<any> {
      return this.http.get<any>(`${this.base_url}/leaves/getAllLeaves/${JSON.stringify({limit: limit, offset: offset})}`);
    };
    requestLeave(leaveData: any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/leaves/requestLeave/`, leaveData);
    };
    getLeavesByEmployeeId(limit:number, offset:number, employeeId: number): Observable<any> {
      return this.http.get<any>(`${this.base_url}/leaves/getAllLeavesById/${JSON.stringify({limit: limit, offset: offset, employee_id: employeeId})}`);
    };
    acceptLeaves(employeeId: number, leaveId: number, data:any): Observable<any> {
      return this.http.put<any>(`${this.base_url}/leaves/acceptLeaves/${JSON.stringify({ employee_id: employeeId, leave_id: leaveId })}`, data);
    };
    rejectLeaves(employeeId: number, leaveId: number, data:any): Observable<any> {
      return this.http.put<any>(`${this.base_url}/leaves/rejectLeaves/${JSON.stringify({ employee_id: employeeId, leave_id: leaveId })}`, data);
    }
}
