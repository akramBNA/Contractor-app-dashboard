import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllUsers(limit: number, offset: number, keyword: string): Observable<any> {
      return this.http.get<any>(`${this.base_url}/users/getAllUsers/${JSON.stringify({ limit: limit, offset: offset, keyword: keyword })}`);
    };
    addUser( userData:any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/users/addUser/`, userData)
    };
    getUserById(userId: number): Observable<any> {  
      return this.http.get<any>(`${this.base_url}/users/getUserById/${userId}`);
    };
    updateUser(userId: number, userData: any): Observable<any> {
      return this.http.put<any>(`${this.base_url}/users/updateUser/${userId}`, userData);
    };
    deleteUser(userId: number): Observable<any> {
      return this.http.delete<any>(`${this.base_url}/users/deleteUser/${userId}`);
    };
    signupWithEmployeeEmail(data: any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/users/signupWithEmployeeEmail/`, data);
    };
}