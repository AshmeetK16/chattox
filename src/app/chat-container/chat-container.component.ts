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
  emojiPickerVisible; 
  message = '';
  messages = [];
  currentUserData = JSON.parse(localStorage.getItem('user'));


  constructor(private firebaseService: FirebaseService, public fireServices: AngularFirestore) { }

  ngOnInit(): void {}

  ngOnChanges(): void{
    this.fireServices.collection('DirectMessages').doc(this.currentUserData.userId).collection('Conversations').doc(this.selectedUser.userId).collection('Messages', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data) =>{
      this.messages = data
    })
  }

  submitMessage(event) {
    let value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) return false;

    let messageData = {
      message: value,
      user: this.currentUserData.userId,
      timestamp: new Date(new Date().getTime())
    }

    this.firebaseService.createMessage(messageData, this.selectedUser);
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }
}
