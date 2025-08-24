import {initializeApp} from 'firebase/app'

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
initializeApp(firebaseConfig)

// init services
const auth = getAuth();

const mailField = document.getElementById('mail');
const resetPassword = document.getElementById('resetPassword');

const resetPasswordFunction = () => {
    const email = mailField.value;

    sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log('Password Reset Email Sent Successfully!');
        let timerInterval
        Swal.fire({
          title: 'Password Reset Link Sent!',
          icon: 'success',
          timer: 2500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            window.location.href = "auth.html"
          }
        })
    })
    .catch(error => {
        let errorCode = error.code
        console.log(errorCode)
        if (errorCode == 'auth/invalid-email' || errorCode == 'auth/user-not-found'){
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please Try Again.',
                footer: '<a href="account.html">Register an account?</a>'
              })
        } else if (errorCode == 'auth/missing-email'){
            Swal.fire({
                icon: 'error',
                title: 'Please complete all required fields.',
                footer: '<a href="account.html">Register an account?</a>'
              })
        }
    })
}

resetPassword.addEventListener('click', resetPasswordFunction);