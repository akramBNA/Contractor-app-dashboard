import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllUsers(): Observable<any> {
      return this.http.get<any>(`${this.base_url}/users/getAllUsers/`);
    };
    addUser( userData:any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/users/addUser/`, userData)
    };
    getUserById(userId: number): Observable<any> {  
      return this.http.get<any>(`${this.base_url}/users/getUserById/${userId}`);
    }
}