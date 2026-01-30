import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContractTypesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;    

    getAllContractTypes(limit: number, offset: number, keyword: string): Observable<any> {
      return this.http.get<any>(`${this.base_url}/contract_types/getAllContractTypes/${limit}/${offset}/${keyword}`);
    };

    addContractType(data: any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/contract_types/addContractType/`, data);
    };

    updateContractType(data: any, contract_type_id: number): Observable<any> {
      return this.http.put<any>(`${this.base_url}/contract_types/updateContractType/${JSON.stringify({contract_type_id:contract_type_id})}`, data);
    };

    deleteContractType(contract_type_id: number): Observable<any> {
      return this.http.delete<any>(`${this.base_url}/contract_types/deleteContractType/${JSON.stringify({contract_type_id:contract_type_id})}`);
    };

}
