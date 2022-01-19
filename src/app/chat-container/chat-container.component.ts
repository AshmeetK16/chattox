import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from "../../services/firebase";
import { AngularFirestore } from '@angular/fire/firestore';

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
  constructor(private firebaseService : FirebaseService, public fireServices: AngularFirestore) {
    fireServices.collection('Messages').valueChanges().subscribe((data) =>{
      console.log(data)
    })
  }

  ngOnInit(): void { }

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
      user: JSON.parse(localStorage.getItem('user')).userId,
      timestamp: new Date().getTime()
    }

    this.firebaseService.createMessage(messageData, this.selectedUser);
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }
}
