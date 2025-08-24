import { initializeApp } from 'firebase/app'

import {
  getFirestore, collection, onSnapshot, doc, setDoc
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
const auth = getAuth(app);

const bookNowButtons = document.getElementsByClassName("bookNowButton")

// //update firebase database

const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]


const timing =
  [
    "07:15 - 08:05",
    "08:05 - 08:55",
    "08:55 - 09:45",
    "09:45 - 10:35",
    "10:35 - 11:25",
    "11:25 - 12:15",
    "12:15 - 13:05",
    "13:05 - 13:55",
    "13:55 - 14:45",
    "14:45 - 15:35",
    "15:35 - 16:25",
    "16:25 - 17:15",
    "17:15 - 18:05"

  ]

//update doc
async function setTimings() {
  const venue = ["C1","C2","C3","C4","L1 T1", "L1 T2", "L1 T3", "L1 T4", "L2 T1", "L2 T2", "L2 T3", "L2 T4"];
  const db = getFirestore(app);

  for (const d of day) {
    for (const t of timing) {
      const docPath = `AvailableTiming/MPH/${d}/${t}`;
      const data = { Venue: venue };

      try {
        await setDoc(doc(db, docPath), data);
        console.log(`Document set for ${docPath}`);
      } catch (error) {
        console.error(`Error setting document for ${docPath}:`, error);
      }
    }
  }
}

setTimings()





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

      //Book Now button

      for (var i = 0; i < bookNowButtons.length; i++) {
        bookNowButtons[i].addEventListener("click", function () {

          if (this.parentElement.querySelector(".card-text")) {
            const cardText = this.parentElement.querySelector(".card-text").innerText;

            // Encode the card text and pass it as a query parameter in the URL when navigating
            const encodedCardText = encodeURIComponent(cardText);
            window.location.href = `bookingForm.html?cardText=${encodedCardText}`;
          } else {
            window.location.href = "bookingForm.html"
          }
        });
      }


    } else {
      // User is signed out
      console.log('User is signed out');
      // Perform actions for signed-out user
      const navUrl = "nav.html #navBarSignedOut"
      $("#nav-placeholder").load(navUrl);


      //Book Now button
      for (var i = 0; i < bookNowButtons.length; i++) {
        bookNowButtons[i].addEventListener("click", function () {
          window.location.href = "auth.html"
        });
      }

    }
  })
});





