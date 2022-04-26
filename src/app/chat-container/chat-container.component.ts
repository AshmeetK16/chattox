import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as uuid from 'node_modules/uuid';
import { FirebaseService } from "../../services/firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  @Input() selectedConversation;
  @Input() allUsers;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() disappearChatToggle: EventEmitter<any> = new EventEmitter();
  @ViewChild('mediaModalBtn') mediaModalBtn: ElementRef;
  emojiPickerVisible;
  message = '';
  messages = [];
  allGroupUsers: any;
  currentUserData: any = this.authService.getCurrentUserData();
  fileDetails;
  percentage;
  isFileUploaded: boolean = false;
  showChatLoader: boolean = false;
  scheduledTimeRadio: any;

  constructor(private firebaseService: FirebaseService,
    public fireServices: AngularFirestore,
    public authService: AuthService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.showChatLoader = true;
    if (this.selectedConversation.groupId) {
      this.currentUserData && this.fireServices.collection('Groups').doc(this.selectedConversation.groupId).collection('Conversations', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data) => {
        this.showChatLoader = false;
        this.messages = data;
      })
    }
    else {
      this.currentUserData && this.fireServices.collection('DirectMessages').doc(this.currentUserData.userId).collection('Conversations').doc(this.selectedConversation.userId).collection('Messages', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data) => {
        this.showChatLoader = false;
        this.messages = data
      })
    }

    const groupUsers = [];
    this.allUsers.forEach(user => {
      return this.selectedConversation.users && this.selectedConversation.users.forEach(userId => {
        if (user.userId === userId) groupUsers.push(user.userName);
      })
    })

    groupUsers.push("You");
    groupUsers.sort()
    this.allGroupUsers = groupUsers.join(", ")
  }

  submitMessage(event?) {
    const value = this.firebaseService.fileDetails && this.firebaseService.fileDetails.downloadURL ? this.firebaseService.fileDetails.downloadURL : event.target.value.trim();
    this.fileDetails = this.firebaseService.fileDetails;
    this.message = '';
    if (value.length < 1) return false;

    let messageData = {
      message: value,
      user: this.currentUserData.userId,
      timestamp: new Date(new Date().getTime()),
      isScheduledMsg: false
    }

    if(this.firebaseService.fileDetails){
      console.log(messageData);
      messageData['fileType'] = this.firebaseService.fileDetails.fileType;
    }

    if (this.selectedConversation.groupId) {
      messageData['username'] = this.currentUserData.userName
    }

    this.firebaseService.createMessage(messageData, this.selectedConversation, this.currentUserData);
    this.fileDetails = undefined;
    this.firebaseService.fileDetails = undefined;  
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }

  handleFileUpload(event) {
    this.isFileUploaded = false;
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      document.getElementById('mediaModalBtn').click();
      this.firebaseService.uploadMediaInStorage(file).subscribe(
        percentage => {
          this.percentage = Math.round(percentage);
          if (this.percentage === 100) {
            this.isFileUploaded = true;
            this.firebaseService.showPreviewLoader = true;
          }
        },
        error => {
          console.log(error);
        });
    }
  }

  handleScheduledMessage(event?) {
    this.fileDetails = this.firebaseService.fileDetails;
    if (this.message === '') return;

    let messageData = {
      message: this.message,
      user: this.currentUserData.userId,
      timestamp: new Date(new Date().getTime()),
      isScheduledMsg: true
    }

    if (this.firebaseService.fileDetails) {
      console.log(messageData);
      messageData['fileType'] = this.firebaseService.fileDetails.fileType;
    }

    if (this.selectedConversation.groupId) {
      messageData['username'] = this.currentUserData.userName
    }

    // Create message will be called after settimeout of defined timinig
    const randomMessageId = uuid.v4();
    let latestMessageData = this.firebaseService.createLatestMessageData(messageData, this.selectedConversation);

    this.selectedConversation['latestMessageData'] = latestMessageData;
    this.selectedConversation['activeUser'] = true;
    this.selectedConversation['disappearChat'] = this.disappearChatToggle;

    this.firebaseService.updateCurrentUserFirebaseRef(true, this.selectedConversation, messageData, randomMessageId);
    this.scheduledTimeRadio = parseInt(this.scheduledTimeRadio);
    const effectiveScheduledTime = this.scheduledTimeRadio*60000;
    // const effectiveScheduledTime = this.scheduledTimeRadio;
    setTimeout(() => {
      messageData.isScheduledMsg = false;
      let currentUser = { ...this.currentUserData, latestMessageData: latestMessageData, activeUser: true, disappearChat: false };
      this.firebaseService.updateSelectedUserFirebaseRef(true, this.selectedConversation.userId, currentUser, messageData, randomMessageId);
    },effectiveScheduledTime);
    this.fileDetails = undefined;
    this.firebaseService.fileDetails = undefined;
  }

  handleDisappearingChatToggle(event) {
    this.disappearChatToggle.emit(event.currentTarget.checked);
  }
}