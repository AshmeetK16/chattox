import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from "../../services/authService";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  @Input() allUsers;
  @Input() allConversations;
  searchText: string;
  views = {
    recentChatsView: true,
    newChatView: false,
    newGroupView: false
  }
  newGroupData: any = [];

  get filteredConversations() {
    return this.allConversations.filter((conversation) => {
      return (
        conversation.userName
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });
  }

  constructor(private authService : AuthService) {}

  ngOnInit() {
    console.log(this.allConversations);
  }
  
  logOut() {
    return this.authService.logout();
  }

  updateView(clickedView) {
    this.views.newChatView = false;
    this.views.recentChatsView = false;
    this.views.newGroupView = false;

    switch(clickedView) {
      case 'newChat': {
        this.views.newChatView = true;
        break;
      }
      case 'newGroup': {
        this.views.newGroupView = true;
        break;
      }
      default : {
        this.views.recentChatsView = true;
      }
    }
  }

  handleConversationClick(clickedUser) {
    if (!this.views.newGroupView) {
      this.conversationClicked.emit(clickedUser);
    }
  }

  newGroupHandling(clickedUser, event) {
    // this.newGroupData = [];
    if (this.views.newGroupView) {
      if (event.target.checked) {
        this.newGroupData.push(clickedUser);
      }
    }
  }

  createGroup() {
    this.newGroupData = [];
  }
}