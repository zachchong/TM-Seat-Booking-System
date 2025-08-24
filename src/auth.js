import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo
} from "firebase/auth";
import { getFirestore, setDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

//Get Elements
const txtEmail = document.getElementById('txtEmail')
const txtPassword = document.getElementById('txtPassword')
const btnLogin = document.getElementById('btnLogin')
const googleSignIn = document.getElementById('googleSignIn')
const resetButton = document.getElementById('resetButton')
const registerButton = document.getElementById('registerButton');
const registerPopup = document.getElementById('registerPopup');
const registerPopupContainer = document.getElementById('registerPopupContainer')

//check student id
const XLSX = require('xlsx');

// // email sign in
// if (btnLogin) {
//   btnLogin.addEventListener('click', e => {
//     const email = txtEmail.value
//     const password = txtPassword.value
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in 
//         const user = userCredential.user;
//         btnLogin.removeEventListener('click', e => { });
//         let timerInterval
//         Swal.fire({
//           title: 'Login Successfully!',
//           icon: 'success',
//           timer: 1500,
//           timerProgressBar: true,
//           didOpen: () => {
//             Swal.showLoading()
//             const b = Swal.getHtmlContainer().querySelector('b')
//             timerInterval = setInterval(() => {
//               b.textContent = Swal.getTimerLeft()
//             }, 100)
//           },
//           willClose: () => {
//             clearInterval(timerInterval)
//           }
//         }).then((result) => {
//           /* Read more about handling dismissals below */
//           if (result.dismiss === Swal.DismissReason.timer) {
//             window.location.href = "index.html";
//           }
//         })
//         // ...
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorMessage)
//         console.log(errorCode)
//         if (errorCode == 'auth/wrong-password') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Invalid Password',
//             text: 'Please Try Again.',
//             footer: '<a href="reset.html">Reset Password?</a>'
//           })
//         } else if (errorCode == 'auth/invalid-email' || errorCode == 'auth/user-not-found') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Invalid Email',
//             text: 'Please Try Again.',
//             footer: '<a href="account.html">Register an account?</a>'
//           })
//         } else if (errorCode == 'auth/missing-password' || errorCode == 'auth/missing-email') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Please complete all required fields.',
//             footer: '<a href="account.html">Register an account?</a>'
//           })
//         }
//       });
//   });
// }


if (googleSignIn) {
  googleSignIn.addEventListener('click', e => {
    // google sign in
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user.email)

        if ((user.email.endsWith('@tmjc.edu.sg')) || (user.email.endsWith("@students.edu.sg"))) {


          var docRef = doc(db, 'users', user.uid)
          onSnapshot(docRef, (snapshot) => {
            if (snapshot.data()) {
              let timerInterval
              Swal.fire({
                title: 'Login Successfully!',
                icon: 'success',
                timer: 1500,
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
                  window.location.href = "index.html";
                }
              })
            } else {
              getInputFromUser(user);
            }
          })

        } else {
          // Delete the account if the domain is not allowed
          user.delete()
            .then(() => {
              // Account deleted successfully
              console.log('Account deleted.');
            })
            .catch((error) => {
              // Handle any errors that occurred during the account deletion process
              console.error('Account deletion error:', error);
            });
          Swal.fire({
            icon: 'error',
            title: 'Sorry...',
            text: 'This system is strictly restricted to TMJC students.',
          })
        }

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });
  })
}

//signout
export function signOut() {
  auth.signOut()
  window.location.href = "index.html";
}

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    console.log('User is signed in');
    // Perform actions for signed-in user
  } else {
    // User is signed out
    console.log('User is signed out');
    // Perform actions for signed-out user
  }
})

// const resetButtonClickHandler = () => {
//   window.location.href = "reset.html";
// };

// //reset password
// if (resetButton) {
//   resetButton.addEventListener('click', resetButtonClickHandler);
// }

// if (registerButton) {
//   registerButton.addEventListener('click', function () {
//     showPopup();
//   });
// }

// function showPopup() {
//   registerPopupContainer.style.visibility = 'visible';
//   registerPopupContainer.style.opacity = '1';
// }

// if (registerPopup) {

//   registerPopup.addEventListener('submit', function (event) {
//     event.preventDefault();
//     const email = document.getElementById('email');
//     const password = document.getElementById('password');

//     createUserWithEmailAndPassword(auth, email.value, password.value)
//       .then((userCredential) => {
//         return setDoc(doc(db, 'users', userCredential.user.uid), {

//         });
//       }).then(() => {
//         let timerInterval
//         Swal.fire({
//           title: 'Account Registered Successfully!',
//           icon: 'success',
//           timer: 1500,
//           timerProgressBar: true,
//           didOpen: () => {
//             Swal.showLoading()
//             const b = Swal.getHtmlContainer().querySelector('b')
//             timerInterval = setInterval(() => {
//               b.textContent = Swal.getTimerLeft()
//             }, 100)
//           },
//           willClose: () => {
//             clearInterval(timerInterval)
//           }
//         }).then((result) => {
//           /* Read more about handling dismissals below */
//           if (result.dismiss === Swal.DismissReason.timer) {
//             window.location.href = "index.html";
//           }
//         })
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         if (errorCode == 'auth/email-already-in-use') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Email already in use.',
//             text: 'Please Try Again.',
//           })
//         }
//       });

//     hidePopup();
//   });

// }
// if (registerPopupContainer) {
//   registerPopupContainer.addEventListener('click', function (event) {
//     if (event.target === registerPopupContainer) {
//       hidePopup();
//     }
//   });
// }

// function hidePopup() {
//   registerPopupContainer.style.visibility = 'hidden';
//   registerPopupContainer.style.opacity = '0';
// }


async function getInputFromUser(user) {
  const { value: nric, dismiss } = await Swal.fire({
    title: 'Kindly provide the last four digits of your NRIC for verification.',
    input: 'text',
    inputPlaceholder: 'Eg: 367U',
    inputAttributes: {
      maxlength: 4,
      autocapitalize: 'off',
      autocorrect: 'off',
    },
    inputValidator: (value) => {
      if (!value) {
        user.delete()
        return 'NRIC is required for verification purposes!';
      }
    },
  });

  if ((dismiss === Swal.DismissReason.backdrop) | (dismiss === Swal.DismissReason.esc)) {
    user.delete()
  }

  if (nric) {
    const filePath = 'student_ID.xlsx';
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to an array of objects
      const studentData = XLSX.utils.sheet_to_json(worksheet);

      // For testing, let's assume you want to check this email and student ID
      const studentIdToCheck = nric;

      // Check if the email exists in the data
      const studentNRIC = studentData.find(student => student.Student_ID === studentIdToCheck);
      if (studentNRIC) {

        let timerInterval
        Swal.fire({
          title: 'Login Successfully!',
          icon: 'success',
          timer: 1500,
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
            window.location.href = "index.html";
          }
        })

        return setDoc(doc(db, 'users', user.uid), {
          studentID: nric
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Sorry...',
          text: 'This system is strictly restricted to TMJC students.',
        })
        // Delete the account if the domain is not allowed
        user.delete()
        return auth.signOut()
      }
    };

    fileReader.onerror = function (event) {
      console.error('Error reading the file:', event.target.error);
    };

    // Read the file asynchronously
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => fileReader.readAsBinaryString(blob))
      .catch(error => console.error('Error fetching the file:', error));
  }
}





