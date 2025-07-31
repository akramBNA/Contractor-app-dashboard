import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class HolidaysService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllHolidays(year: number): Observable<any> {
      return this.http.get<any>(`${this.base_url}/holidays/getAllHolidaysByYear/${JSON.stringify({year:year})}`);
    };
    addHoliday(holiday_data: any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/holidays/addHoliday/`, holiday_data);
    }
}
