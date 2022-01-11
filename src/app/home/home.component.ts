import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../../services/authService";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUSerAuthenticated = this.firebaseService.isLoggedIn;
  conversation;

  constructor(private firebaseService : FirebaseService) { }

  ngOnInit() {
  }

  onConversationSelected(conversation){
    this.conversation = conversation;
  }

}
