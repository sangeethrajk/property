import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SchemesData } from '../components/view-schemes/view-schemes.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getAllSchemesData(id: number): Observable<any> {
    const url = `${this.apiUrl}getAllSchemeData`;
    const requestBody = { id: id };
    return this.http.post<any>(url, requestBody);
  }

  createSchemeData(schemeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl + 'saveSchemeData', schemeData, { headers });
  }

  // getSchemeDataById(id: number): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const requestBody = { id: id };
  //   const url = `${this.apiUrl}getSchemeData`;
  //   console.log(id);
  //   return this.http.post<any>(url, requestBody, { headers });
  // }

  getSchemeDataById(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { id: id };
    const url = `${this.apiUrl}getSchemeData`;
    return this.http.post<any>(url, requestBody, { headers });
  }

}
