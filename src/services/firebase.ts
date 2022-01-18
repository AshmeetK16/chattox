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

    createMessage(messageData, selectedUser){
        let currentUserData = JSON.parse(localStorage.getItem('user'));
        let conversationData = {
            [selectedUser.userId] : {[uuid.v4()] : messageData} 
        }
        return this.fireServices.collection('Messages').doc(currentUserData.uid).set(conversationData);
    }
}