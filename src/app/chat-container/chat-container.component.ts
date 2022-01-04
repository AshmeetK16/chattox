import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  @Input() conversation;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  // emojiPickerVisible;
  message = '';
  constructor() { }

  ngOnInit(): void { }

  submitMessage(event) {
    let value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) return false;
    this.conversation.latestMessage = value;
    this.conversation.messages.unshift({
      id: 1,
      body: value,
      time: '10:21',
      me: true,
    });
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }
}
