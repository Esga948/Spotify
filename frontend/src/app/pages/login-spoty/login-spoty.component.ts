import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-spoty',
  templateUrl: './login-spoty.component.html',
  styleUrls: ['./login-spoty.component.scss'],
})
export class LoginSpotyComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    
  }

  onLogin(): void {
    this.apiService.login();
  }
}
