import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InicioAppService } from 'src/app/services/inicio-app.service';
import { UserApp } from 'src/app/models/user-app';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-app',
  templateUrl: './register-app.component.html',
  styleUrls: ['./register-app.component.scss'],
})
export class RegisterAppComponent implements OnInit {
  constructor(private inicioAppService: InicioAppService, private router: Router) {}

  ngOnInit(): void {}

  onRegister(form: NgForm): void {
    this.inicioAppService.registerApp(form.value).subscribe((res) => {
      this.router.navigateByUrl('/home');
    });
  }
}
