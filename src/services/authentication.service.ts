import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.backendURL
  constructor(private http: HttpClient) {}

  login(credentials: {
    user_email: string;
    user_password: string;
  }): Observable<any> {
    return this.http.post(`${this.baseURL}/users/UserLogin/`, credentials);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
