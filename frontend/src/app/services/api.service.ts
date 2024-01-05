import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSpoty } from '../models/user-spoty';
import { Track } from '../models/track';
import { Artist } from '../models/artist';
import { tap } from 'rxjs';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_SERVER = 'http://localhost:8080';
  appSubject = new BehaviorSubject(false);
  constructor(private http: HttpClient) {}

  login() {
    window.location.href = `${this.API_SERVER}/login`;
  }

  getUser(userId: string): Observable<UserSpoty> {
    return this.http.get<UserSpoty>(`${this.API_SERVER}/datsU/${userId}`);
  }

  getTrack(trackId: string): Observable<Track> {
    return this.http.get<Track>(`${this.API_SERVER}/datsT/${trackId}`);
  }

  getArtist(artistId: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.API_SERVER}/datsA/${artistId}`);
  }
}
