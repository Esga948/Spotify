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
  private name: string = '';
  private email: string = '';
  constructor(private httpClient: HttpClient) {}

  registerApp(user: UserApp): Observable<JwtResp> {
    return this.httpClient
      .post<JwtResp>(`${this.APP_SERVER}/registerApp`, user)
      .pipe(
        tap((res: JwtResp) => {
          if (res) {
            // guardar token
            this.saveToken(res.dataUser.aToken, res.dataUser.expiresIn);
            this.saveName(user.name);
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

  authToken(frontToken: string): Observable<{ tokens: boolean }> {
    const email = this.getEmail();
    return this.httpClient
      .post<{ tokens: boolean }>(`${this.APP_SERVER}/authToken`, {
        email,
        token: frontToken,
      })
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

  logout(userId: string): Observable<any> {
    this.token = '';
    this.email = '';
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EXPIRES_IN');
    localStorage.removeItem('NAME');
    localStorage.removeItem('EMAIL');
    return this.httpClient.post(`${this.APP_SERVER}/logout/${userId}`, {});
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('EXPIRES_IN', expiresIn);
    this.token = token;
  }

  private getToken(): string {
    return (this.token = localStorage.getItem('ACCESS_TOKEN') ?? '');
  }

  private saveName(name: string): void {
    console.log('NAME: ' + name);
    this.name = name;
  }

  getName(): string {
    return localStorage.getItem('NAME') ?? '';
  }

  private saveEmail(email: string): void {
    localStorage.setItem('EMAIL', email);
    this.email = email;
  }

  getEmail(): string {
    return localStorage.getItem('EMAIL') ?? '';
  }
}
