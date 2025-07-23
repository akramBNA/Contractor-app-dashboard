import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })

export class TasksService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    addTask(project_id:number, Task_data: any): Observable<any> {    
      return this.http.post<any>(`${this.base_url}/tasks/addTask/${JSON.stringify({project_id: project_id})}`, Task_data);
    }

}