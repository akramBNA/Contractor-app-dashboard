import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class MissionsService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllActiveMissions(): Observable<any> {
      return this.http.get<any>(`${this.base_url}/missions/getAllMissions/`);
    };
    getMissionById(missionId: string): Observable<any> {
      return this.http.get<any>(`${this.base_url}/missions/getMissionById/${missionId}`);
    };
    addMission(missionData: any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/missions/addMission/`, missionData);
    };
    editMission(missionId: string, missionData: any): Observable<any> {
      return this.http.put<any>(`${this.base_url}/missions/editMission/${missionId}`, missionData);
    };
}