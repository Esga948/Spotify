import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InicioAppService } from 'src/app/services/inicio-app.service';
import { UserApp } from 'src/app/models/user-app';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-app',
  templateUrl: './login-app.component.html',
  styleUrls: ['./login-app.component.scss']
})
export class LoginAppComponent implements OnInit{
  constructor(private inicioAppService: InicioAppService, private router: Router) {}

  ngOnInit(): void {
  }

  onLogin(form: NgForm): void{
    this.inicioAppService.loginApp(form.value).subscribe(res => {
      this.router.navigateByUrl('/home')
    })
  }
}