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
            this.saveEmail(user.email);
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

  authToken(frontToken: string): Observable<{tokens: boolean}> {
    const email = this.getEmail();
    return this.httpClient
      .post<{tokens: boolean}>(`${this.APP_SERVER}/authToken`, { email, token: frontToken })
      .pipe(
        tap((res) => {
          if (res.tokens) {
            console.log('Los tokens coinciden');
          } else {
            console.log('Los tokens no coinciden');
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
    return (this.token = localStorage.getItem('ACCESS_TOKEN') ?? '');
  }

  private saveEmail(email: string): void {
    localStorage.setItem('EMAIL', email);
  }
  private getEmail(): string {
    return localStorage.getItem('EMAIL') ?? '';
  }
}
