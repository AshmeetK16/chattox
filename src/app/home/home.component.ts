import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../../services/authService";
import { FirebaseService } from "../../services/firebase";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUSerAuthenticated = this.authService.isLoggedIn;
  selectedUser;
  allUsers: any = [];
  allConversations: any = [];

  constructor(private authService: AuthService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getAllUsers().subscribe((res) => {
      return res.docs.map((userData) => {
        if (userData.data()['userId'] !== JSON.parse(localStorage.getItem('user')).userId)
          this.allUsers.push(userData.data());
      })
    });

    this.firebaseService.getAllConversations().subscribe(res => {
      this.allConversations = [];
      return res.map((userData) => {
        this.allConversations.push(userData.payload.doc.data());
      })
    })
  }

  onConversationSelected(selectedUser) {
    this.selectedUser = selectedUser;
  }
}
