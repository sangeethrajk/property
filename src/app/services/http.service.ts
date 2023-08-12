import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SchemesData } from '../components/view-schemes/view-schemes.component';
import { UnitData } from '../components/master-data/master-data.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getAllSchemesData(id: number): Observable<any> {
    const url = `${this.apiUrl}getAllSchemes`;
    const requestBody = { id: id };
    return this.http.post<any>(url, requestBody);
  }

  createSchemeData(schemeData: any): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(this.apiUrl + 'saveSchemeData', schemeData, { headers });
  }

  getSchemeDataById(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { id: id };
    const url = `${this.apiUrl}getSchemeData`;
    return this.http.post<any>(url, requestBody, { headers });
  }

  deleteSchemeDataById(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}deleteScheme/${id}`;
    return this.http.delete<any>(url, { headers });
  }

  createUnitMasterData(unitData: any[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl + 'saveUnitData', unitData, { headers });
  }

  getUnitMasterData(id: number): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(this.apiUrl + 'getUnitOfOneScheme', { id }, { headers });
  }

  updateUnitMasterData(unitData: any[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl + 'saveUnitData', unitData, { headers });
  }

  createAllottee(allotteeTableData: any[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl + 'saveAllottees', allotteeTableData, { headers });
  }

  getAllAllottees(allotteeNId: number): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { id: allotteeNId };
    return this.http.post<any[]>(this.apiUrl + 'getAllAllottees', requestBody, { headers });
  }

}
