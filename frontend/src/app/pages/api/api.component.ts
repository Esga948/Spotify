import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { UserSpoty } from 'src/app/models/user-spoty';
import { Artist } from 'src/app/models/artist';
import { Track } from 'src/app/models/track';
import { InicioAppService } from 'src/app/services/inicio-app.service';
import { forkJoin } from 'rxjs';
import { from } from 'rxjs';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {
  userId: string = '';
  tracks: Track[] = [];
  artists: Artist[] = [];
  user: UserSpoty = {
    id: '',
    name: '',
    email: '',
    tracks: [],
  };
  track: Track = {
    id: '',
    name: '',
    idAlbum: '',
    album: '',
    idsArtist: [],
  };
  artist: Artist = {
    id: '',
    name: '',
    genres: [],
  };
  genres: { [key: string]: number } = {};
  artistNames: { [trackId: string]: string } = {};

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private inicioAppService: InicioAppService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') ?? '';
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.apiService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      this.getTracksInfo();
    });
  }
  /*
  getTracksInfo(): void {
    for (let trackId of this.user.tracks) {
      this.apiService.getTrack(trackId).subscribe((track) => {
        console.log(track);
        this.tracks.push(track);
        if (track.idsArtist.length > 0) {
          this.getArtistsInfo(track.idsArtist, track.id);
        }
      });
    }
  }
*/
  getTracksInfo(): void {
    const observables = this.user.tracks.map((trackId) =>
      this.apiService.getTrack(trackId)
    );

    forkJoin(observables).subscribe((tracks) => {
      tracks.forEach((track, index) => {
        this.tracks.push(track);

        if (track.idsArtist.length > 0) {
          this.getArtistsInfo(track.idsArtist, index);
        }
      });
    });
  }

  getArtistsInfo(artistIds: string[], index: number): void {
    const artistObservables = artistIds.map(
      (artistId) => this.apiService.getArtist(artistId),
      console.log('ARTISTS ID: ' + artistIds)
    );

    forkJoin(artistObservables).subscribe((artists) => {
      this.artists.push(...artists);
      artists.forEach((artist) => {
        artist.genres.forEach((genre) => {
          if (!this.genres[genre]) {
            this.genres[genre] = 1;
          } else {
            this.genres[genre]++;
          }
        });
      });
      const artistNames = artists.map((artist) => artist.name).join(', ');
      this.artistNames[index] = artistNames;
    });
  }

  getTopGenres(): string[] {
    return Object.keys(this.genres)
      .sort((a, b) => this.genres[b] - this.genres[a])
      .slice(0, 5);
  }

  logout(): void {
    this.inicioAppService.logout(this.userId).subscribe(() => {
      window.location.href = '/login';
    });
  }
}
