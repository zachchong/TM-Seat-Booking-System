import { initializeApp } from 'firebase/app'

import {
  getFirestore, collection, onSnapshot, updateDoc, arrayRemove, doc
} from 'firebase/firestore'

import {
  getAuth
} from "firebase/auth"

import { signOut } from './auth.js'
import { submitBooking } from './submitBooking.js'

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

$(function () {
  // listen for auth status changes
  auth.onAuthStateChanged(user => {
    if (user) {
      // init services
      const db = getFirestore()
      const dbRef = collection(db, "users", user.uid, 'Bookings');

      //default
      var bookingData = {}
      onSnapshot(dbRef, (snapshot) => {
        snapshot.forEach(doc => {

          //Get the current date
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          const givenDate = new Date(doc.id);
          givenDate.setHours(0, 0, 0, 0);

          if (givenDate >= currentDate) {
            bookingData[doc.id] = doc.data()
          }

        })

        var numberOfElements = Object.keys(bookingData).length;

        if (numberOfElements == 0) {
          console.log(numberOfElements)
        } else {
          createTable(bookingData, 'upcoming', user)
          console.log(numberOfElements)
        }

      })


      // Get the radio buttons within the group
      const radioButtons = document.querySelectorAll('input[name="btnradio"]');

      // Attach event listener to each radio button
      radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('change', function () {

          let tableContainer = document.getElementById('table');
          let table = document.getElementById('tableChild');
          if (table != null) {
            tableContainer.removeChild(table)
          }

          bookingData = {}
          // Handle radio button change event
          if (this.checked) {
            if (this.value == 'upcoming') {
              onSnapshot(dbRef, (snapshot) => {
                snapshot.forEach(doc => {

                  //Get the current date
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);

                  const givenDate = new Date(doc.id);
                  givenDate.setHours(0, 0, 0, 0);

                  if (givenDate >= currentDate) {
                    bookingData[doc.id] = doc.data()
                  }

                })

                createTable(bookingData, this.value, user)
              })

            } else {

              onSnapshot(dbRef, (snapshot) => {
                snapshot.forEach(doc => {
                  //Get the current date
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);

                  const givenDate = new Date(doc.id);
                  givenDate.setHours(0, 0, 0, 0);

                  if (givenDate < currentDate) {
                    bookingData[doc.id] = doc.data()
                  }
                })
                createTable(bookingData, this.value, user)
              })
            }
          }
        });
      });

    } else {
      console.log('no user')
    }
  })
});

const bookNowButton = document.getElementById('bookNowButton');
if (bookNowButton) {
  bookNowButton.addEventListener('click', e => {
    window.location.href = 'bookingForm.html'
  })
}

function createTable(bookingData, category, user) {

  var table = document.createElement("table");
  table.className = "custom-table";
  table.id = 'tableChild'

  // Create the table header row
  var headerRow = document.createElement("tr");

  // header
  var headerCell1 = document.createElement("th");
  headerCell1.className = "header-cell";
  var headerCell1Text = document.createTextNode("Date");
  headerCell1.appendChild(headerCell1Text);
  headerRow.appendChild(headerCell1);

  var headerCell2 = document.createElement("th");
  headerCell2.className = "header-cell";
  var headerCell2Text = document.createTextNode("Venue");
  headerCell2.appendChild(headerCell2Text);
  headerRow.appendChild(headerCell2);

  var headerCell3 = document.createElement("th");
  headerCell3.className = "header-cell";
  var headerCell3Text = document.createTextNode("Table");
  headerCell3.appendChild(headerCell3Text);
  headerRow.appendChild(headerCell3);

  var headerCell4 = document.createElement("th");
  headerCell4.className = "header-cell";
  var headerCell4Text = document.createTextNode("Timing");
  headerCell4.appendChild(headerCell4Text);
  headerRow.appendChild(headerCell4);

  var headerCell5 = document.createElement("th");
  headerCell5.className = "header-cell";
  var headerCell5Text = document.createTextNode("Status");
  headerCell5.appendChild(headerCell5Text);
  headerRow.appendChild(headerCell5);

  if (category == 'upcoming') {
    var headerCell6 = document.createElement("th");
    headerCell6.className = "header-cell";
    var headerCell6Text = document.createTextNode("Action");
    headerCell6.appendChild(headerCell6Text);
    headerRow.appendChild(headerCell6);
  }

  // Append the header row to the table
  table.appendChild(headerRow);

  for (const date in bookingData) {
    const venueData = bookingData[date]

    for (const venue in venueData) {
      var timingData = venueData[venue]
      const sortedKeys = Object.keys(timingData).sort((a, b) => {
        return a.localeCompare(b); // Compare and sort based on time
      });

      const sortedTimeSlots = {};
      sortedKeys.forEach(key => {
        sortedTimeSlots[key] = timingData[key];
      });

      timingData = sortedTimeSlots

      for (const timing in timingData) {
        const locations = timingData[timing]

        for (const location of locations) {

          var row = document.createElement("tr");

          var datecell = document.createElement("td");
          datecell.className = "custom-cell";
          datecell.textContent = date
          row.appendChild(datecell)

          var venuecell = document.createElement("td");
          venuecell.className = "custom-cell";
          venuecell.textContent = venue
          row.appendChild(venuecell)

          var locationcell = document.createElement("td");
          locationcell.className = "custom-cell";
          locationcell.textContent = location
          row.appendChild(locationcell)

          var timingcell = document.createElement("td");
          timingcell.className = "custom-cell";
          timingcell.textContent = timing
          row.appendChild(timingcell)

          var statuscell = document.createElement("td");
          statuscell.className = "custom-cell";

          // Get the current date
          const currentDate = new Date();

          // Parse the given date ("22 May 2023")
          const givenDate = new Date(date);

          // Compare the dates
          if (givenDate >= currentDate) {
            statuscell.textContent = "Confirmed"
          } else if (givenDate < currentDate) {
            statuscell.textContent = "Completed"
          }

          row.appendChild(statuscell)

          if (category == 'upcoming') {
            
            const cancelButtonCell = document.createElement('td');
            cancelButtonCell.className = 'custom-cell';

            // Create a Cancel button element
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.className = 'btn btn-danger btn-sm';

            // Add event listener to the Cancel button
            cancelButton.addEventListener('click', () => {

              Swal.fire({
                title: 'Are you sure you want to cancel your booking?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  // delete user's booking

                  const docRef = doc(db, 'users', user.uid, 'Bookings', date)
                  const updateData = {
                    [venue + '.' + timing]: arrayRemove(location)
                  }
                  // Perform the update
                  updateDoc(docRef, updateData)
                    .then(() => {
                      console.log('Value deleted successfully.');
                      let tableContainer = document.getElementById('table');
                      let table = document.getElementById('tableChild');
                      if (table != null) {
                        tableContainer.removeChild(table)
                      }
                    })
                    .catch((error) => {
                      console.error('Error deleting value:', error);
                    });


                  // delete system database
                  const docRefBookedTiming = doc(db, 'BookedTiming', date)
                  const updateBookedTiming = {
                    [venue + '.' + location]: arrayRemove(timing)
                  }
                  // Perform the update
                  updateDoc(docRefBookedTiming, updateBookedTiming)
                    .then(() => {
                      console.log('Value deleted successfully from BookedTiming.');
                    })
                    .catch((error) => {
                      console.error('Error deleting value:', error);
                    });
                }
              })
            });

            // Append the Cancel button to the cell
            cancelButtonCell.appendChild(cancelButton);
            row.appendChild(cancelButtonCell)



            // add more slot
            // Create a cell for the Cancel button

            // Create a Cancel button element
            const addSlotButton = document.createElement('button');
            addSlotButton.textContent = '+1Slot';
            addSlotButton.className = 'btn btn-sm btn-success';
            addSlotButton.addEventListener('click', () => {

              const timings = [
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
              ];

              const currentTiming = timing;
              const nextSlotIndex = timings.findIndex(timing => timing === currentTiming) + 1;

              if (nextSlotIndex !== -1 && nextSlotIndex < timings.length) {
                const nextSlotTiming = timings[nextSlotIndex];
                submitBooking(date, venue, location, nextSlotTiming)

              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Sorry, this is the last slot available.',
              })
              }
            })

            cancelButtonCell.appendChild(addSlotButton);

            row.appendChild(cancelButtonCell)

          }

          table.appendChild(row);
        }
      }
    }
  }
  var textNode = document.getElementById("text");
  if (textNode) {
    // Get the parent node of the text node
    var parentNode = textNode.parentNode;

    // Remove the text node from the parent node
    parentNode.removeChild(textNode);
  }

  var rowCount = table.rows.length;
  if (rowCount == 1) {

    table.deleteRow(0)
    var text = document.createElement("h3");
    text.textContent = "You do not have any bookings yet.";
    text.id = "text"

    // Get a reference to the table div
    var tableDiv = document.getElementById("table");

    // Append the text node after the table div
    tableDiv.parentNode.insertBefore(text, tableDiv.nextSibling);
  }

  let tableContainer = document.getElementById('table');
  tableContainer.appendChild(table);
}


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

