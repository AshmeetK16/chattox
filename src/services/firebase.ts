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

        const currentUserFirebaseRef = this.fireServices.collection('DirectMessages').doc(this.currentUserData.userId).collection('Conversations').doc(selectedUser.userId);
        const selectedUserFirebaseRef = this.fireServices.collection('DirectMessages').doc(selectedUser.userId).collection('Conversations').doc(this.currentUserData.userId);

        let latestMessageData = {
            message : messageData.message,
            timestamp : messageData.timestamp
        }

        selectedUser['latestMessageData'] = latestMessageData;

        currentUserFirebaseRef.collection('Messages').doc(randomMessageId).set(messageData);    
        currentUserFirebaseRef.get().subscribe(res => {
            if(!res.data()){
                currentUserFirebaseRef.set(selectedUser);
            }
            else {
                currentUserFirebaseRef.update({latestMessageData : latestMessageData});
            }
        })

        selectedUserFirebaseRef.get().subscribe(res => {
            if(!res.data()){
                selectedUserFirebaseRef.set(selectedUser);
            }
            else {
                selectedUserFirebaseRef.update(latestMessageData);
            }
        })   

        selectedUserFirebaseRef.collection('Messages').doc(randomMessageId).set(messageData);
    }

    getAllConversations() { 
        return this.fireServices.collection('DirectMessages').doc(this.currentUserData.userId).collection('Conversations').snapshotChanges();
    }
}