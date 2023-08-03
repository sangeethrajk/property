import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SchemesData } from '../components/view-schemes/view-schemes.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = 'http://localhost:8080/saveSchemeData';

  constructor(private http: HttpClient) { }

  getAllSchemesData(): Observable<SchemesData[]> {
    return this.http.get<SchemesData[]>(this.apiUrl);
  }

  createSchemeData(schemeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, schemeData, { headers });
  }
}
