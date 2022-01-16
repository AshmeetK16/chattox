import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from './../services/firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = JSON.parse(localStorage.getItem('user'));
  isLoggedIn = this.user ? true : false;
  
  constructor(public firebaseAuth : AngularFireAuth,
    private router: Router, public firebaseService : FirebaseService) { }

  async signIn(email: string, password : string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
    .then(res=>{
      this.isLoggedIn = true;
      this.firebaseService.getUser(res.user.uid).subscribe(res => {
        const userData = res.payload.data();
        localStorage.setItem('user',JSON.stringify(userData));
        return this.router.navigate(['/home']);
      });
    })
  }
  
  async signUp(signUpData){
    await this.firebaseAuth.createUserWithEmailAndPassword(signUpData.email,signUpData.password)
    .then(res=>{
      this.isLoggedIn = true;
      const userData = { userId: res.user.uid, userName: signUpData.username, email: signUpData.email };
      this.firebaseService.createUser(userData);
      localStorage.setItem('user',JSON.stringify(userData));
      return this.router.navigate(['/home']);
    })
  }
  
  logout() {
    this.isLoggedIn = false;
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    return this.router.navigate(['/login']);
  }
}