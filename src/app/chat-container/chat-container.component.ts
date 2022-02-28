import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible; 
  message = '';
  messages = [];
  currentUserData: any;


  constructor(private firebaseService: FirebaseService, public fireServices: AngularFirestore, public authService: AuthService) { }

  ngOnInit(): void {
    this.currentUserData = this.authService.getCurrentUserData();
    
    if(this.selectedConversation.groupId){
      this.currentUserData && this.fireServices.collection('Groups').doc(this.selectedConversation.groupId).collection('Conversations', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data) => {
        this.messages = data;
      })
    }
    else{
      this.currentUserData && this.fireServices.collection('DirectMessages').doc(this.currentUserData.userId).collection('Conversations').doc(this.selectedConversation.userId).collection('Messages', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data) =>{
        console.log(data)
        this.messages = data
      })
    }
  }
  
  ngOnChanges(): void{
    this.currentUserData && this.fireServices.collection('DirectMessages').doc(this.currentUserData.userId).collection('Conversations').doc(this.selectedConversation.userId).collection('Messages', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data) =>{
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

    if(this.selectedConversation.groupId){
      messageData['username'] = this.currentUserData.userName
    }

    this.firebaseService.createMessage(messageData, this.selectedConversation, this.currentUserData);
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }
}
