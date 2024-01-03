import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InicioAppService } from 'src/app/services/inicio-app.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth-token',
  templateUrl: './auth-token.component.html',
  styleUrls: ['./auth-token.component.scss'],
})
export class AuthTokenComponent implements OnInit {
  constructor(
    private inicioAppService: InicioAppService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onToken(form: NgForm): void {
    this.inicioAppService.authToken(form.value).subscribe((res) => {
      if (res.tokens) {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
