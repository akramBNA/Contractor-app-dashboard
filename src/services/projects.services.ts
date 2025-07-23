import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllProjects(limit:number, offset:number, keyword:string): Observable<any> {
      return this.http.get<any>(`${this.base_url}/projects/getAllProjects/${JSON.stringify({ limit: limit, offset: offset, keyword: keyword })}`);
    };

    addProject(project_data: any): Observable<any> {    
      return this.http.post<any>(`${this.base_url}/projects/addProject/`, project_data);
    }

    getProjectById(project_id: number): Observable<any> {
      return this.http.get<any>(`${this.base_url}/projects/getProjectById/${JSON.stringify({project_id: project_id })}`);
    };

    deleteProject(project_id: number): Observable<any> {
      return this.http.delete<any>(`${this.base_url}/projects/deleteProject/${JSON.stringify({project_id: project_id })}`);
    };
}