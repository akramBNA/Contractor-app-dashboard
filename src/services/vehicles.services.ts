import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehiclesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllVehicles(limit: number, offset: number, keyword: string): Observable<any> {
      return this.http.get<any>(`${this.base_url}/vehicles/getAllVehicles/${JSON.stringify({ limit: limit, offset: offset, keyword: keyword })}`);
    };

    addVehicle(data: any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/vehicles/addVehicle/`, data);
    };

    getVehicleById(id: number): Observable<any> {
      return this.http.get<any>(`${this.base_url}/vehicles/getVehicleById/${id}`);
    };

    updateVehicle(id: number, data: any): Observable<any> {
      return this.http.put<any>(`${this.base_url}/vehicles/updateVehicle/${id}`, data);
    };

    deleteVehicle(id: number): Observable<any> {
      return this.http.delete<any>(`${this.base_url}/vehicles/deleteVehicle/${id}`);
    };
}