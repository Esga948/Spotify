import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginAppComponent } from './pages/login-app/login-app.component';
import { RegisterAppComponent } from './pages/register-app/register-app.component';
import { InicioAppService } from './services/inicio-app.service';
import { AuthTokenComponent } from './pages/auth-token/auth-token.component';
import { ApiComponent } from './pages/api/api.component';
import { LoginSpotyComponent } from './pages/login-spoty/login-spoty.component';
import { ApiService } from './services/api.service';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginAppComponent,
    RegisterAppComponent,
    AuthTokenComponent,
    ApiComponent,
    LoginSpotyComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [InicioAppService, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
