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

        this.fireServices.collection('Messages').doc(currentUserData.userId).collection(selectedUser.userId).doc(randomMessageId).set(messageData);

        this.fireServices.collection('Messages').doc(selectedUser.userId).collection(currentUserData.userId).doc(randomMessageId).set(messageData);
    }
}