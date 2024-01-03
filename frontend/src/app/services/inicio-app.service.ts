import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserApp } from '../models/user-app';
import { JwtResp } from '../models/jwtresp';
import { tap } from 'rxjs';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class InicioAppService {
  APP_SERVER: string = 'http://localhost:8080';
  appSubject = new BehaviorSubject(false);
  private token: string = '';
  constructor(private httpClient: HttpClient) {}

  registerApp(user: UserApp): Observable<JwtResp> {
    return this.httpClient
      .post<JwtResp>(`${this.APP_SERVER}/registerApp`, user)
      .pipe(
        tap((res: JwtResp) => {
          if (res) {
            // guardar token
            this.saveToken(res.dataUser.aToken, res.dataUser.expiresIn);
          }
        })
      );
  }

  loginApp(user: UserApp): Observable<JwtResp> {
    return this.httpClient
      .post<JwtResp>(`${this.APP_SERVER}/loginApp`, user)
      .pipe(
        tap((res: JwtResp) => {
          if (res) {
            // guardar token
            this.saveToken(res.dataUser.aToken, res.dataUser.expiresIn);
          }
        })
      );
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EXPIRES_IN');
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('EXPIRES_IN', expiresIn);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('ACCESS_TOKEN') ?? '';
    }
    return this.token;
  }
}
