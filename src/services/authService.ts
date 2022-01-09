import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn = false
  constructor(public firebaseAuth : AngularFireAuth) { }

  async signIn(email: string, password : string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
    .then(res=>{
      this.isLoggedIn = true;
      console.log(res);
      localStorage.setItem('user',JSON.stringify(res.user));
    })
  }
  
  async signUp(signUpData){
    await this.firebaseAuth.createUserWithEmailAndPassword(signUpData.email,signUpData.password)
    .then(res=>{
      this.isLoggedIn = true;
      console.log(res);
      localStorage.setItem('user',JSON.stringify(res.user));
    })
  }
  
  logout(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
}