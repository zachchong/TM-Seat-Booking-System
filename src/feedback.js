import { initializeApp } from 'firebase/app'

import {
  getFirestore, collection, onSnapshot, updateDoc, arrayRemove, doc
} from 'firebase/firestore'

import {
  getAuth
} from "firebase/auth"

import { signOut } from './auth.js'

//Firebase Config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// init firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore()
const auth = getAuth(app);


//Navigation bar

$(function () {
    // listen for auth status changes
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        console.log('User is signed in');
        // Perform actions for signed-in user
        const navUrl = "nav.html #navBarSignedIn"
        $("#nav-placeholder").load(navUrl, function () {
          $("#nav-placeholder").on("click", "#signOutLink", function () {
            signOut()
          });
        });
  
      } else {
        // User is signed out
        console.log('User is signed out');
        // Perform actions for signed-out user
        const navUrl = "nav.html #navBarSignedOut"
        $("#nav-placeholder").load(navUrl);
      }
    })
  });


