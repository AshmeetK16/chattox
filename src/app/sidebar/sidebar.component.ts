import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from "../../services/authService";
import { FirebaseService } from "../../services/firebase";
import * as uuid from '../../../node_modules/uuid';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  @Input() allUsers;
  @Input() allGroupConversations;
  @Input() allUserConversations;
  allConversations: any = [];
  searchText: string;
  groupName: string = "";
  currentUserData: any;
  views = {
    recentChatsView: true,
    newChatView: false,
    newGroupView: false
  }
  usersPresentInGroup: any = [];

  get filteredConversations() {
    return this.allConversations.filter((conversation) => {
      return (
        conversation.userName
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });
  }

  constructor(private authService: AuthService, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.currentUserData = this.authService.getCurrentUserData();
  }

  ngOnChanges() {
    this.allConversations = [...this.allUserConversations, ...this.allGroupConversations];
    this.allConversations.sort(function (a, b) {
      return b.latestMessageData.timestamp - a.latestMessageData.timestamp
    });
  }

  logOut() {
    this.allConversations = [];
    return this.authService.logout();
  }

  updateView(clickedView) {
    this.views.newChatView = false;
    this.views.recentChatsView = false;
    this.views.newGroupView = false;

    switch (clickedView) {
      case 'newChat': {
        this.views.newChatView = true;
        break;
      }
      case 'newGroup': {
        this.usersPresentInGroup = [];
        this.views.newGroupView = true;
        break;
      }
      default: {
        this.views.recentChatsView = true;
      }
    }
  }

  handleConversationClick(clickedConversation) {
    if (!this.views.newGroupView) {
      this.conversationClicked.emit(clickedConversation);
    }
  }

  newGroupHandling(clickedConversation, event) {
    if (this.views.newGroupView) {
      if (event.target.checked) {
        this.usersPresentInGroup.push(clickedConversation.userId);
      }
      else {
        this.usersPresentInGroup = this.usersPresentInGroup.filter(user => user !== clickedConversation.userId)
      }
    }
    console.log(this.usersPresentInGroup)
  }

  emojiClicked(event) {
    this.groupName += event.emoji.native;
  }

  createGroup() {
    this.usersPresentInGroup.push(this.currentUserData.userId);

    const groupData = {
      adminId: this.currentUserData.userId,
      groupId: uuid.v4(),
      groupName: this.groupName,
      users: this.usersPresentInGroup,
      latestMessageData: {
        message: `You created group ${this.groupName}`,
        timestamp: new Date(new Date().getTime())
      }
    }

    this.firebaseService.createGroup(groupData)
    this.usersPresentInGroup = [];
  }
}