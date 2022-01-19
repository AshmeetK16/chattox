import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as uuid from '../../node_modules/uuid';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

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
        let currentUserData = JSON.parse(localStorage.getItem('user'));
        const randomMessageId = uuid.v4();

        let conversationData = {
            [selectedUser.userId]: { [randomMessageId] : messageData }
        }
        // this.fireServices.collection('Messages').doc(currentUserData.userId).set(conversationData)
        this.fireServices.collection('Messages/' + currentUserData.userId).doc(selectedUser.user).update(conversationData)

        // conversationData = { 
        //     [currentUserData.userId]: { [randomMessageId] : messageData }
        // };
        // this.fireServices.collection('Messages').doc(selectedUser.userId).set(conversationData);
    }
}