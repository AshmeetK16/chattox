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

    createMessage(messageData, selectedConversation, currentUserData) {
        const randomMessageId = uuid.v4();

        if(selectedConversation.groupId){
            const selectedConversationFirebaseRef = this.fireServices.collection('Groups').doc(selectedConversation.groupId);
    
            let latestMessageData = {
                user : messageData.user,
                message : messageData.message,
                timestamp : messageData.timestamp
            }

            if(selectedConversation.groupId){
                latestMessageData['username'] = this.currentUserData.userName
              }
    
            selectedConversationFirebaseRef.update({latestMessageData : latestMessageData});   
            selectedConversationFirebaseRef.collection('Conversations').doc(randomMessageId).set(messageData);   
        }
        else{
            const currentUserFirebaseRef = this.fireServices.collection('DirectMessages').doc(currentUserData.userId).collection('Conversations').doc(selectedConversation.userId);
            const selectedConversationFirebaseRef = this.fireServices.collection('DirectMessages').doc(selectedConversation.userId).collection('Conversations').doc(this.currentUserData.userId);

            let latestMessageData = {
                message : messageData.message,
                timestamp : messageData.timestamp
            }

            selectedConversation['latestMessageData'] = latestMessageData;
            let currentUser = {...currentUserData, latestMessageData : latestMessageData};

            currentUserFirebaseRef.collection('Messages').doc(randomMessageId).set(messageData);    
            currentUserFirebaseRef.get().subscribe(res => {
                if(!res.data()){
                    currentUserFirebaseRef.set(selectedConversation);
                }
                else {
                    currentUserFirebaseRef.update({latestMessageData : latestMessageData});
                }
            })

            selectedConversationFirebaseRef.get().subscribe(res => {
                if(!res.data()){
                    selectedConversationFirebaseRef.set(currentUser);
                }
                else {
                    selectedConversationFirebaseRef.update(latestMessageData);
                }
            })   

            selectedConversationFirebaseRef.collection('Messages').doc(randomMessageId).set(messageData);
        }
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