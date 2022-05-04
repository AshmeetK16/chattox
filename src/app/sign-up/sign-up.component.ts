import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/authService';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  email:string;
  password: string;
  name: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signUp(){
    const fullname = document.forms['registerForm']['name'];
    const email = document.forms['registerForm']['registerEmail'];
    const password = document.forms['registerForm']['registerPassword'];
    const fullNameError = document.getElementById("nameError");
    const emailError = document.getElementById("registerEmailError");
    const passwordError = document.getElementById("registerPasswordError");

    fullname.classList.remove("visible");
    emailError.classList.remove("visible");
    passwordError.classList.remove("visible");

    if (fullname.value == '') {
      fullNameError.classList.add("visible");
      fullname.focus();      
    }

    if (email.value == '') {
      emailError.classList.add("visible");
      email.focus();
    }

    if (password.value == '') {
      passwordError.classList.add("visible");
      password.focus();
    }

    if (email.value == '' || password.value == '' || fullname.value == '') return false;

    const userData = {email: this.email, password: this.password, username: this.name};
    return this.authService.signUp(userData);
  }
}
