import { initializeApp } from 'firebase/app'
import {
    getFirestore, setDoc, collection, onSnapshot, doc, getDoc, query, where, updateDoc
} from 'firebase/firestore'
import {
    getAuth
} from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore()
const auth = getAuth(app);

export function submitBooking(date, venueType, venue, time) {

    if (venue == 'Select an option') {
        console.log('Please fill in the form completely.')
        return
    }

    //Check bookedslot 
    var bookedVenue = {}
    var bookedRef = doc(db, 'BookedTiming', date)
    getDoc(bookedRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log(data);

                if (data) {
                    if (data[venueType]) {
                        bookedVenue = data[venueType];
                        if (bookedVenue[venue]) {
                            console.log(bookedVenue);
                            console.log(bookedVenue[venue]);
                            let bookedArray = bookedVenue[venue]
                            if (bookedArray.includes(time)) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Sorry, the next slot is booked.',
                                })
                            } else {
                                update(date, venueType, venue, time)
                            }
                        } else {
                            update(date, venueType, venue, time)
                        }
                    } else {
                        update(date, venueType, venue, time)
                    }

                } else {
                    update(date, venueType, venue, time)
                }
            } else {
                update(date, venueType, venue, time)
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
}

function update(date, venueType, venue, time) {
    let user = auth.currentUser.uid
    var arrayU = []

    //Update 'users' collection
    getDoc(doc(db, 'users', user, 'Bookings', date)).then(docSnap => {
        if (docSnap.exists() && docSnap.data()[venueType] && docSnap.data()[venueType][time]) {
            if (docSnap.data()[venueType]) {
                arrayU.push(...docSnap.data()[venueType][time])
                if (!arrayU.includes(venue)) {
                    arrayU.push(venue)
                }
                updateDoc(doc(db, 'users', user, 'Bookings', date), {
                    [venueType + "." + time]: arrayU
                }, { merge: true })
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Successful',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        window.location.href = "myBookings.html";
                    }
                })
            }
        } else {
            setDoc(doc(db, 'users', user, 'Bookings', date), {
                [venueType]: { [time]: [venue] }
            }, { merge: true });
            Swal.fire({
                icon: 'success',
                title: 'Booking Successful',
                confirmButtonText: 'OK'
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    window.location.href = "myBookings.html";
                }
            })
        }
    })

    var arrayB = []

    //Update 'BookedTiming' collection
    getDoc(doc(db, 'BookedTiming', date)).then(docSnap => {
        if (docSnap.exists() && docSnap.data()[venueType] && docSnap.data()[venueType][venue]) {
            arrayB.push(...docSnap.data()[venueType][venue])
            console.log(docSnap.data()[venueType][venue])
            if (!arrayB.includes(time)) {
                arrayB.push(time)
            }
            //console.log(arrayB)
            return updateDoc(doc(db, 'BookedTiming', date), {
                [venueType + '.' + venue]: arrayB
            }, { merge: true })
        } else {
            setDoc(doc(db, 'BookedTiming', date), {
                [venueType]: { [venue]: [time] }
            }, { merge: true });
        }
    })
}