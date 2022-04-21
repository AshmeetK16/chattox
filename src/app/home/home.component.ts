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
  selectedConversation;
  allUsers: any = [];
  allUserConversations: any = [];
  allGroupConversations: any = [];
  currentUserData: any;
  showConversationsLoader: boolean = false;
  disappearChatToggleForSelectedUser: boolean = false;

  constructor(private authService: AuthService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.currentUserData = this.authService.getCurrentUserData();
    this.showConversationsLoader = true;
    this.firebaseService.getAllUsers().subscribe((res) => {
      this.showConversationsLoader = false;
      return res.docs.map((userData) => {
        if (userData.data()['userId'] !== this.currentUserData.userId)
          this.allUsers.push(userData.data());
      })
    });

    this.firebaseService.getAllConversations(this.currentUserData).subscribe(res => {
      this.showConversationsLoader = false;
      this.allUserConversations = [];
      return res.map((userData) => {
        this.allUserConversations.push(userData.payload.doc.data());
      })
    })

    this.firebaseService.getAllGroups().subscribe(res => {
      this.showConversationsLoader = false;
      this.allGroupConversations = [];
      return res.map(groupData => {
        this.allGroupConversations.push(groupData.payload.doc.data());
      })
    })
  }

  updateDisappearChatToggle(disappearToggleValue) {
    this.disappearChatToggleForSelectedUser = disappearToggleValue;
  }

  onConversationSelected(selectedConversation) {
    if (this.selectedConversation) 
      this.firebaseService.updateActiveUserData({state: false, disappearingChatState: this.disappearChatToggleForSelectedUser}, this.selectedConversation);
    
    if (this.disappearChatToggleForSelectedUser) {
      this.firebaseService.deleteActiveUserChat(this.selectedConversation);
    }
    this.selectedConversation = selectedConversation;    
    this.firebaseService.updateActiveUserData({state: true, disappearingChatState: this.disappearChatToggleForSelectedUser}, this.selectedConversation);
  }
}
