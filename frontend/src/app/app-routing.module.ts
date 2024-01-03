import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginAppComponent } from './pages/login-app/login-app.component';
import { RegisterAppComponent } from './pages/register-app/register-app.component';
import { AuthTokenComponent } from './pages/auth-token/auth-token.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  //{ path: 'home', loadChildren: () => import('./pages/pagesApp/pages-app.module').then(m => m.PagesAppModule) },
  { path: 'registerApp', component: RegisterAppComponent },
  { path: 'loginApp', component: LoginAppComponent },
  { path: 'authToken', component: AuthTokenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
