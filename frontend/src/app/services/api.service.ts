import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private API_SERVER = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  getUser(userId:string): Observable<any>{
    return this.http.get(`${this.API_SERVER}/datsU/${userId}`);
  }
}
