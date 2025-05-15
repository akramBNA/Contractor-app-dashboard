import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllProjects(): Observable<any> {
      return this.http.get<any>(`${this.base_url}/projects/getAllProjects/`);
    };

    addProject(project_data: any): Observable<any> {    
      return this.http.post<any>(`${this.base_url}/projects/addProject/`, project_data);
    }
}
