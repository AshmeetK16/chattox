import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from './../services/firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userStatus = "Hey there! I am using WhatsApp."
  isLoggedIn = JSON.parse(localStorage.getItem('user')) ? true : false;
  public invalidLogin: boolean = false;
  public showLoginLoader: boolean = false;
  
  constructor(public firebaseAuth : AngularFireAuth,
    private router: Router, public firebaseService : FirebaseService) { }

  async signIn(email: string, password : string){
    this.invalidLogin = false;
    this.showLoginLoader = true;
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
    .then(res=>{
      this.isLoggedIn = true;
      this.firebaseService.getUser(res.user.uid).subscribe(res => {
        const userData = res.payload.data();
        localStorage.setItem('user',JSON.stringify(userData));
        this.showLoginLoader = true;
        return this.router.navigate(['/home']);
      });
    })
    .catch(error => {
      this.invalidLogin = true;
      this.showLoginLoader = true;
     })
  }
  
  async signUp(signUpData){
    await this.firebaseAuth.createUserWithEmailAndPassword(signUpData.email,signUpData.password)
    .then(res=>{
      this.isLoggedIn = true;
      const userData = { userId: res.user.uid, userName: signUpData.username, email: signUpData.email, userStatus: this.userStatus };
      this.firebaseService.createUser(userData);
      localStorage.setItem('user',JSON.stringify(userData));
      return this.router.navigate(['/home']);
    })
  }

  getCurrentUserData() {
    return JSON.parse(localStorage.getItem('user'));
  }
  
  logout() {
    this.isLoggedIn = false;
    this.showLoginLoader = false;
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    return this.router.navigate(['/login']);
  }
}