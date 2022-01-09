import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/services/authService';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  email:string;
  password: string;
  name: string;

  constructor(private firebaseservice: FirebaseService) { }

  ngOnInit() {
  }

  signUp(){
    const userData = {email: this.email, password: this.password, username: this.name};
    return this.firebaseservice.signUp(userData);
  }
}
