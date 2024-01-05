import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginAppComponent } from './pages/login-app/login-app.component';
import { RegisterAppComponent } from './pages/register-app/register-app.component';
import { AuthTokenComponent } from './pages/auth-token/auth-token.component';
import { LoginSpotyComponent } from './pages/login-spoty/login-spoty.component';
import { ApiComponent } from './pages/api/api.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'registerApp', component: RegisterAppComponent },
  { path: 'loginApp', component: LoginAppComponent },
  { path: 'authToken', component: AuthTokenComponent },
  { path: 'login', component: LoginSpotyComponent },
  { path: 'api/:userId', component: ApiComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
