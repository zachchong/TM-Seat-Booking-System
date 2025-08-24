import { initializeApp } from 'firebase/app'

import {
  getFirestore, collection, onSnapshot, updateDoc, arrayRemove, doc
} from 'firebase/firestore'

import {
  getAuth, updatePassword, reauthenticateWithCredential
} from "firebase/auth"

import { signOut } from './auth.js'

import 'dotenv/config'

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
const user = auth.currentUser;

//navigation bar

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

$(function () {
  'use strict';
  window.addEventListener('load', function () {
    var form = document.getElementById('changingPasswordForm');
    form.addEventListener('submit', function (event) {
      event.preventDefault()
      if (form.checkValidity() === true) {
        const user = auth.currentUser;
        var newPasswordInput = document.getElementById('confirmed-password').value;
        updatePassword(user, newPasswordInput).then(() => {
          alert('Password Changed')
          console.log("success")
        }).catch((error) => {
          console.log(error)
          if (error.code === 'auth/requires-recent-login') {
            alert('User signed in too long ago. Re-authenticate your credential.')
            promptReauthenticate()
          }
        });
      }

      // Custom validation
      var newPasswordInput = document.getElementById('new-password');
      var confirmedPasswordInput = document.getElementById('confirmed-password');
      var newPasswordError = document.getElementById('new-password-error');
      var confirmedPasswordError = document.getElementById('confirmed-password-error');

      if (newPasswordInput.value.length < 6 && newPasswordInput.value.length != 0) {
        newPasswordInput.classList.add('is-invalid');
        newPasswordError.textContent = 'Password must be at least 6 characters long.';
      } else if (newPasswordInput.value.length == 0) {
        newPasswordInput.classList.add('is-invalid');
        newPasswordError.textContent = 'Please enter your new password.';
      } else {
        newPasswordInput.classList.remove('is-invalid');
      }

      if (newPasswordInput.value !== confirmedPasswordInput.value) {
        confirmedPasswordInput.classList.add('is-invalid');
        confirmedPasswordError.textContent = 'Passwords do not match.';
      } else {
        confirmedPasswordInput.classList.remove('is-invalid');
      }

      form.classList.add('was-validated');
    }, false);
  }, false);
})();


// reautentification
function promptReauthenticate() {
  console.log('go')
  window.location.href = 'auth.html';
}