import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../../services/authService";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email : string;
  password: string;

  constructor( private firebaseService : FirebaseService) { }

  ngOnInit() {
  }

  signIn(){
    return this.firebaseService.signIn(this.email,this.password);
  }

}
