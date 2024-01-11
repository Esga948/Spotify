import { Component, OnInit } from '@angular/core';
import { InicioAppService } from 'src/app/services/inicio-app.service';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-auth-token',
  templateUrl: './auth-token.component.html',
  styleUrls: ['./auth-token.component.scss'],
})

export class AuthTokenComponent implements OnInit {
  constructor(private inicioAppService: InicioAppService, private apiService: ApiService) {}

  ngOnInit(): void {

  }

  onToken(form: NgForm): void {
    this.inicioAppService.authToken(form.value).subscribe((res) => {
      if (res.tokens) {
        this.apiService.login();
      }
    });
  }

  sendToken(){
    this.inicioAppService.reenviarToken();
  }
}
