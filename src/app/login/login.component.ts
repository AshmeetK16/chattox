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
    const email = document.forms['loginForm']['email'];
    const password = document.forms['loginForm']['password'];
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    emailError.classList.remove("visible");
    passwordError.classList.remove("visible");

    if (email.value == '') {
      emailError.classList.add("visible");
      email.focus();
    }

    if (password.value == '') {
      passwordError.classList.add("visible");
      password.focus();
    }

    if(email.value == '' || password.value == '') return false;

    return this.authService.signIn(this.email,this.password);
  }
}
