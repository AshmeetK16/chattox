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
        return this.fireServices.collection('Users').get();
    }

    createMessage(messageData, selectedUser, currentUserData) {
        const randomMessageId = uuid.v4();

        const currentUserFirebaseRef = this.fireServices.collection('DirectMessages').doc(currentUserData.userId).collection('Conversations').doc(selectedUser.userId);
        const selectedUserFirebaseRef = this.fireServices.collection('DirectMessages').doc(selectedUser.userId).collection('Conversations').doc(this.currentUserData.userId);

        let latestMessageData = {
            message : messageData.message,
            timestamp : messageData.timestamp
        }

        selectedUser['latestMessageData'] = latestMessageData;
        let currentUser = {...currentUserData, latestMessageData : latestMessageData};

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
                selectedUserFirebaseRef.set(currentUser);
            }
            else {
                selectedUserFirebaseRef.update(latestMessageData);
            }
        })   

        selectedUserFirebaseRef.collection('Messages').doc(randomMessageId).set(messageData);
    }

    getAllConversations(currentUserData) { 
        return this.fireServices.collection('DirectMessages').doc(currentUserData.userId).collection('Conversations').snapshotChanges();
    }

    getAllGroups(currentUserData){
        return this.fireServices.collection('Groups').snapshotChanges();
    }

    createGroup(groupData){
        groupData.users.forEach(userId => {
            this.fireServices.collection('Users').doc(userId).get().subscribe(res => {
                const userData = res.data();
                const groups = userData.groups ? [...userData.groups, groupData.groupId] : [groupData.groupId]; 
                
                this.fireServices.collection('Users').doc(userData.userId).update({
                    groups : groups
                })    
            })
        });
        
        this.fireServices.collection('Groups').doc(groupData.groupId).set(groupData);
    }
}