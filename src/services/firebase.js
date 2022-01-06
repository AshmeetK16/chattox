import firebase from 'firebase';
import firebaseConfig from "./config";

firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore();

export const database = {
    users: firestore.collection('users'),
    groups : firestore.collection('groups')
}

export default firebase;