import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as uuid from '../../node_modules/uuid';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    currentUserData = JSON.parse(localStorage.getItem('user'));
    public fileDetails;

    constructor(public fireServices: AngularFirestore, public storage: AngularFireStorage,) { }

    createUser(userData) {
        return this.fireServices.collection('Users').doc(userData.userId).set(userData);
    }

    getUser(userId) {
        return this.fireServices.collection('Users').doc(userId).snapshotChanges();
    }

    getAllUsers() {
        return this.fireServices.collection('Users').get();
    }

    createMessage(messageData, selectedConversation, currentUserData) {debugger;
        const randomMessageId = uuid.v4();

        if (selectedConversation.groupId) {
            const selectedConversationFirebaseRef = this.fireServices.collection('Groups').doc(selectedConversation.groupId);

            let latestMessageData = {
                user: messageData.user,
                message: messageData.message,
                timestamp: messageData.timestamp
            }

            selectedConversationFirebaseRef.update({ latestMessageData: latestMessageData });
            selectedConversationFirebaseRef.collection('Conversations').doc(randomMessageId).set(messageData);
        }
        else {
            const currentUserFirebaseRef = this.fireServices.collection('DirectMessages').doc(currentUserData.userId).collection('Conversations').doc(selectedConversation.userId);
            const selectedConversationFirebaseRef = this.fireServices.collection('DirectMessages').doc(selectedConversation.userId).collection('Conversations').doc(this.currentUserData.userId);

            let latestMessageData = {
                message: messageData.message,
                timestamp: messageData.timestamp
            }
            if (messageData.fileType === 'image/png') {
                latestMessageData.message = 'Image';
            }

            if (messageData.fileType === 'video/mp4') {
                latestMessageData.message = 'Video';
            }

            if (messageData.fileType === 'audio/ogg') {
                latestMessageData.message = 'Audio';
            }

            if (selectedConversation.groupId) {
                latestMessageData['username'] = this.currentUserData.userName
            }
            console.log(latestMessageData);

            selectedConversation['latestMessageData'] = latestMessageData;
            let currentUser = { ...currentUserData, latestMessageData: latestMessageData };

            currentUserFirebaseRef.collection('Messages').doc(randomMessageId).set(messageData);
            currentUserFirebaseRef.get().subscribe(res => {
                if (!res.data()) {
                    currentUserFirebaseRef.set(selectedConversation);
                }
                else {
                    currentUserFirebaseRef.update({ latestMessageData: latestMessageData });
                }
            })

            selectedConversationFirebaseRef.get().subscribe(res => {
                if (!res.data()) {
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

    getAllGroups() {
        return this.fireServices.collection('Groups').snapshotChanges();
    }

    createGroup(groupData) {
        groupData.users.forEach(userId => {
            this.fireServices.collection('Users').doc(userId).get().subscribe(res => {
                const userData = res.data();
                const groups = userData.groups ? [...userData.groups, groupData.groupId] : [groupData.groupId];

                this.fireServices.collection('Users').doc(userData.userId).update({
                    groups: groups
                })
            })
        });

        this.fireServices.collection('Groups').doc(groupData.groupId).set(groupData);
    }

    uploadMediaInStorage(fileToUpload) {
        let ruid = uuid.v4();
        const filePath = `messages/${ruid}`;

        const storageRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, fileToUpload);
        uploadTask.snapshotChanges().pipe(
            finalize(() => {
                storageRef.getDownloadURL().subscribe(downloadURL => {
                    const fileMetadata = {
                        downloadURL: downloadURL,
                        fileType: fileToUpload.type
                    }
                    console.log(fileMetadata);
                    this.fileDetails = fileMetadata;
                });
            })
        ).subscribe();
        return uploadTask.percentageChanges();
    }
}
