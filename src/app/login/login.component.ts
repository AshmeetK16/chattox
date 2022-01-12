import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/authService";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email : string;
  password: string;

  constructor( private authService : AuthService) { }

  ngOnInit() {
  }

  signIn(){
    return this.authService.signIn(this.email,this.password);
  }

}
