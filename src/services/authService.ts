import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  user = JSON.parse(localStorage.getItem('user'));
  isLoggedIn = this.user ? true : false;
  
  constructor(public firebaseAuth : AngularFireAuth,
    private router: Router) { }

  async signIn(email: string, password : string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
    .then(res=>{
      this.isLoggedIn = true;
      console.log(res);
      localStorage.setItem('user',JSON.stringify(res.user));
      return this.router.navigate(['/home']);
    })
  }
  
  async signUp(signUpData){
    await this.firebaseAuth.createUserWithEmailAndPassword(signUpData.email,signUpData.password)
    .then(res=>{
      this.isLoggedIn = true;
      console.log(res);
      localStorage.setItem('user',JSON.stringify(res.user));
      return this.router.navigate(['/home']);
    })
  }
  
  logout(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
}