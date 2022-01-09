// import {AngularFireModule} from "@angular/fire/compat"
import { AngularFireAuth } from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore"
// import {firebaseConfig} from "./config";

// AngularFireModule.initializeApp(firebaseConfig)
// const firestore = AngularFirestoreModule

// export const database = {
//     users: AngularFirestore.collection('users'),
//     groups : AngularFirestore.collection('groups')
// }


// export class AuthService {
//     userData: any; // Save logged in user data
  
//     constructor(
//       public afs: AngularFirestore,   // Inject Firestore service
//       public afCollection: AngularFirestoreCollection, // Inject Firebase auth service
//       public afAuth: AngularFireAuth, // Inject Firebase auth service
//     ) {    
//       /* Saving user data in localstorage when 
//       logged in and setting up null when logged out */
//       this.afAuth.authState.subscribe(user => {
//         if (user) {
//           this.userData = user;
//           localStorage.setItem('user', JSON.stringify(this.userData));
//           JSON.parse(localStorage.getItem('user'));
//         } else {
//           localStorage.setItem('user', null);
//           JSON.parse(localStorage.getItem('user'));
//         }
//       })
//     }
//   }