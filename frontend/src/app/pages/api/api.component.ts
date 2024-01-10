import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { UserSpoty } from 'src/app/models/user-spoty';
import { Artist } from 'src/app/models/artist';
import { Track } from 'src/app/models/track';
import { InicioAppService } from 'src/app/services/inicio-app.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  userAppName: string = '';
  userAppEmail: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private inicioAppService: InicioAppService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') ?? '';
    this.userAppName = this.inicioAppService.getName();
    this.userAppEmail = this.inicioAppService.getEmail();
    this.getUserInfo();
    this.users();
  }

  getUserInfo(): void {
    this.apiService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      this.getTracksInfo();
    });
  }

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
    const artistObservables = artistIds.map((artistId) =>
      this.apiService.getArtist(artistId)
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

  users(): void {
    this.apiService.users(this.userAppEmail, this.userId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        if (err.status === 409) {
          alert("Ya existe una cuenta vinculada con este usuario de Spotify")
          window.location.href = '/registerApp';
        } else {
          console.error('Error al obtener el usuario');
        }
      }
    );
  }

  logout(): void {
    this.inicioAppService.logout();
    window.open('https://open.spotify.com/intl-es', '_blank');
    alert("Cierra sesion en Spotify")
    window.location.href = '/loginApp';
  }
}
