import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/authService";
import { FirebaseService } from "../../services/firebase";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUSerAuthenticated = this.authService.isLoggedIn;
  conversation;
  allUsers: any = [];

  constructor(private authService : AuthService,
    private firebaseService : FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getAllUsers().subscribe((res) => {
      return res.map((userData) => {
        this.allUsers.push(userData.payload.doc.data());
      })
    });
    
  }

  onConversationSelected(conversation){
    this.conversation = conversation;
  }

}
