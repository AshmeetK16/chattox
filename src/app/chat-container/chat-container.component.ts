import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from "../../services/firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  @Input() selectedUser;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  // emojiPickerVisible;
  message = '';
  messages = [];
  currentUserData = JSON.parse(localStorage.getItem('user'));

  constructor(private firebaseService: FirebaseService, public fireServices: AngularFirestore) { console.log(this.currentUserData)}

  ngOnInit(): void {
    this.fireServices.collection('Messages').doc(this.currentUserData.userId).collection(this.selectedUser.userId, ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data) =>{
      this.messages = data;
    })
  }

  submitMessage(event) {
    let value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) return false;
    // this.conversation.latestMessage = value;
    // this.conversation.messages.unshift({
    //   id: 1,
    //   body: value,
    //   time: '10:21',
    //   me: true,
    // });

    let messageData = {
      message: value,
      user: this.currentUserData.userId,
      timestamp: new Date().getTime()
    }

    this.firebaseService.createMessage(messageData, this.selectedUser);
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }
}
