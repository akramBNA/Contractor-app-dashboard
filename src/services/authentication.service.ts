import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.backendURL;
  constructor(private http: HttpClient) {}

  login(credentials: {
    user_email: string;
    user_password: string;
  }): Observable<any> {
    return this.http.post(`${this.baseURL}/users/UserLogin/`, credentials);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_lastname');
    sessionStorage.removeItem('user_role');
  }

  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  setUserData(userData: any): void {
    sessionStorage.setItem('user_name',JSON.stringify(userData.data.user_name));
    sessionStorage.setItem('user_lastname',JSON.stringify(userData.data.user_lastname));
    sessionStorage.setItem('user_role',JSON.stringify(userData.data.user_role_type));
  }
}
