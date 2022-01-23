import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as uuid from '../../node_modules/uuid';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
    currentUserData = JSON.parse(localStorage.getItem('user'));

    constructor(public fireServices : AngularFirestore) { }

    createUser(userData) {
        return this.fireServices.collection('Users').doc(userData.userId).set(userData);
    }

    getUser(userId) {
        return this.fireServices.collection('Users').doc(userId).snapshotChanges();
    }

    getAllUsers() {
        return this.fireServices.collection('Users').snapshotChanges();
    }

    createMessage(messageData, selectedUser) {
        const randomMessageId = uuid.v4();

        this.fireServices.collection('Messages').doc(this.currentUserData.userId).collection(selectedUser.userId).doc(randomMessageId).set(messageData);

        this.fireServices.collection('Messages').doc(selectedUser.userId).collection(this.currentUserData.userId).doc(randomMessageId).set(messageData);
    }

    getAllConversations() { 
        return this.fireServices.collection('Messages').snapshotChanges();
    }
}