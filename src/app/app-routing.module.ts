import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Components */
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';


/* Services */
import { isUserAuthentcatedRoutesGuard } from '../services/isUserAuthentcated-routes-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, canActivate: [isUserAuthentcatedRoutesGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
