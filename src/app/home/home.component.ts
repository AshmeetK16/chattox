import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/authService";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUSerAuthenticated = this.authService.isLoggedIn;
  conversation;

  constructor(private authService : AuthService) { }

  ngOnInit() {
  }

  onConversationSelected(conversation){
    this.conversation = conversation;
  }

}
