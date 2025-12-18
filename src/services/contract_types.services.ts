import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContractTypesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllContractTypes(): Observable<any> {
      return this.http.get<any>(`${this.base_url}/contract_types/getAllContractTypes/`);
    };

    updateContractType(contractTypeId: number, data: any): Observable<any> {
      return this.http.put<any>(`${this.base_url}/contract_types/updateContractType/${contractTypeId}/`, data);
    };

}
