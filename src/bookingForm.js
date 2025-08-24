import { initializeApp } from 'firebase/app'

import {
  getFirestore, collection, onSnapshot, doc
} from 'firebase/firestore'

import {
  getAuth
} from "firebase/auth"

// Import function from another file
import './submitBooking.js'
import './auth.js'
import { submitBooking } from './submitBooking.js'
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

// init services
const db = getFirestore()

//Venue ref
const VenueRef = collection(db, 'AvailableTiming')

// real time collection data
onSnapshot(VenueRef, (snapshot) => {
  let availableVenue = []
  snapshot.docs.forEach((doc) => {
    availableVenue.push(doc.id)
  })
  //console.log(availableVenue)

  const selectVenue = document.getElementById("mySelect");

  for (let i = 0; i < availableVenue.length; i++) {
    const option = document.createElement("option");
    option.value = availableVenue[i];
    option.text = availableVenue[i];
    selectVenue.appendChild(option);
  }
  const cardText = getQueryParam("cardText");
  console.log(cardText)
  console.log(selectVenue.options.length)

  // Loop through the options and find the option with matching text
  for (let i = 0; i < selectVenue.options.length; i++) {
    if (mySelect.options[i].text === cardText) {
      console.log(mySelect.options[i].text)
      mySelect.selectedIndex = i;
      break; // Stop the loop once the match is found
    }
  }

  // Get all the carousel-item elements within carousel-inner
  const carouselItems = carouselInner.querySelectorAll('.carousel-item');

  // Loop through the carousel-items and set the src attribute of the img elements
  carouselItems.forEach((item, index) => {
    const imgElement = item.querySelector('img');

    if (cardText == "Atrium") {
      generateCarousel(atriumUrls)
    } else if (cardText == "Café") {
      generateCarousel(cafeUrls)
    } else if (cardText == "GO Benches") {
      generateCarousel(GOBenchesUrls)
    } else if (cardText == "Library") {
      generateCarousel(libraryUrls)
    } else if (cardText == "Outside Staffroom") {
      generateCarousel(staffroomUrls)
    } else if (cardText == "Pavilion") {
      generateCarousel(pavilionUrls)
    } else if (cardText == "TM Cove") {
      generateCarousel(TMCoveUrls)
    }
  });

})

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


// Get the carousel-inner element
const carouselInner = document.querySelector('.carousel-inner');

// Array of image URLs that you want to set for each slide
const atriumUrls = [
  'img/seats/Atrium L1.jpeg',
  'img/seats/Atrium L2.jpeg'
];

const cafeUrls = [
  'img/seats/cafeA.jpeg',
  'img/seats/cafeB.jpeg',
  'img/seats/cafeC.jpeg'
];

const GOBenchesUrls = [
  'img/seats/GOBenches.jpeg'
];

const pavilionUrls = [
  'img/seats/pavilion.jpeg'
];

const staffroomUrls = [
  'img/seats/staffroom1.jpeg',
  'img/seats/staffroom3.jpeg',
  'img/seats/staffroom2.jpeg'
];

const libraryUrls = [
  'img/seats/studycarrel.jpeg',
  'img/seats/Library1.jpeg',
  'img/seats/Library2.jpeg'
];

const TMCoveUrls = [
  'img/seats/TMCove1.jpeg',
  'img/seats/TMCove2.jpeg',
  'img/seats/TMCove3.jpeg'
]

var selectVenue = document.getElementById("mySelect");
selectVenue.addEventListener("change", e => {
  let selectedVenue = selectVenue.options[selectVenue.selectedIndex].value;

  // Get all the carousel-item elements within carousel-inner
  const carouselItems = carouselInner.querySelectorAll('.carousel-item');

  // Loop through the carousel-items and set the src attribute of the img elements
  carouselItems.forEach((item, index) => {
    const imgElement = item.querySelector('img');

    if (selectedVenue == "Atrium") {
      generateCarousel(atriumUrls)
    } else if (selectedVenue == "Café") {
      generateCarousel(cafeUrls)
    } else if (selectedVenue == "GO Benches") {
      generateCarousel(GOBenchesUrls)
    } else if (selectedVenue == "Library") {
      generateCarousel(libraryUrls)
    } else if (selectedVenue == "Outside Staffroom") {
      generateCarousel(staffroomUrls)
    } else if (selectedVenue == "Pavilion") {
      generateCarousel(pavilionUrls)
    } else if (selectedVenue == "TM Cove") {
      generateCarousel(TMCoveUrls)
    }
  });

  // Check whether timing has been selected or not
  var previousTimingSelect = document.getElementById("SelectTiming");
  if (previousTimingSelect != null) {
    //Delete timing so that user can choose the timing again
    let parentElement = previousTimingSelect.parentNode;
    let labelElement = document.getElementById("TimingLabel");
    parentElement.removeChild(previousTimingSelect);
    labelElement.remove()
    let labelElement2 = document.getElementById("AddSlotLabel");
    labelElement2.remove()
  }

  //Delete venue if previous has been chosen, so the user rechoose
  var previousVenueSelect = document.getElementById("SelectVenue");
  if (previousVenueSelect != null) {
    let parentElement = previousVenueSelect.parentNode;
    let labelElement = document.getElementById("VenueLabel");
    parentElement.removeChild(previousVenueSelect);
    labelElement.remove()
  }

  if (daySelected) {
    // Check Booked Timing
    var bookedRef = doc(db, 'BookedTiming', dateSelected)
    onSnapshot(bookedRef, (snapshot) => {
      if (snapshot.data()) {
        bookedVenue = snapshot.data()[selectedVenue]
      }
    })
    showTiming(selectedVenue, daySelected)
  }
})

let dateSelected = ""
let daySelected = ""
var bookedVenue = {}

$(function () {
  $("#datepicker-1").datepicker({
    minDate: 0,
    dateFormat: "dd MM yy",
    onSelect: function () {
      var date = $(this).datepicker('getDate');
      var day = ($.datepicker.formatDate("DD", date));
      var selectVenue = document.getElementById("mySelect");
      var selectedOptionValue = selectVenue.options[selectVenue.selectedIndex].value;
      var previousTimingSelect = document.getElementById("SelectTiming");
      dateSelected = ($.datepicker.formatDate("dd MM yy", date))
      daySelected = day

      //Delete timing if previous has been chosen, so the user rechoose
      if (previousTimingSelect != null) {
        let parentElement = previousTimingSelect.parentNode;
        let labelElement = document.getElementById("TimingLabel");
        parentElement.removeChild(previousTimingSelect);
        labelElement.remove()
        let labelElement2 = document.getElementById("AddSlotLabel");
        labelElement2.remove()
      }

      //Delete venue if previous has been chosen, so the user rechoose
      var previousVenueSelect = document.getElementById("SelectVenue");
      if (previousVenueSelect != null) {
        let parentElement = previousVenueSelect.parentNode;
        let labelElement = document.getElementById("VenueLabel");
        parentElement.removeChild(previousVenueSelect);
        labelElement.remove()
      }

      // Check Booked Timing
      var bookedRef = doc(db, 'BookedTiming', dateSelected)
      onSnapshot(bookedRef, (snapshot) => {
        if (snapshot.data()) {
          bookedVenue = snapshot.data()[selectedOptionValue]
        } else {
          bookedVenue = {}
        }
        showTiming(selectedOptionValue, day)
      })


    }
  });
});

function showTiming(venue, day) {


  var TimingRef = collection(db, 'AvailableTiming', venue, day)
  onSnapshot(TimingRef, (snapshot) => {

    var previousTimingSelect = document.getElementById("SelectTiming");

    if (previousTimingSelect != null) {
      //Delete timing so that user can choose the timing again
      let parentElement = previousTimingSelect.parentNode;
      let labelElement = document.getElementById("TimingLabel");
      parentElement.removeChild(previousTimingSelect);
      labelElement.remove()
      let labelElement2 = document.getElementById("AddSlotLabel");
      labelElement2.remove()
    }

    var previousVenueSelect = document.getElementById("SelectVenue");

    if (previousVenueSelect != null) {
      let parentElement = previousVenueSelect.parentNode;
      let labelElement = document.getElementById("VenueLabel");
      parentElement.removeChild(previousVenueSelect);
      labelElement.remove()
    }

    let availableTiming = []
    snapshot.docs.forEach((doc) => {
      availableTiming.push(doc.id)
    })
    let select = document.createElement("select");
    select.id = "SelectTiming"

    // Create a default option with placeholder text
    let defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.text = "Select an option";

    // Append the default option to the select element
    select.appendChild(defaultOption);

    // Loop through the array and create an option element for each item
    availableTiming.forEach(function (optionText) {
      let option = document.createElement("option");
      option.text = optionText;

      // Check BookedVenue, if all venues are booked at the timing, disable the timing
      let totalBookings = 0;
      //console.log(bookedVenue)
      for (let timeArray in bookedVenue) {
        console.log(bookedVenue[timeArray])
        if (bookedVenue[timeArray].includes(optionText)) {
          totalBookings += 1
        }
      }

      // Check available venues at the timing
      var venueReff = doc(db, 'AvailableTiming', venue, day, optionText)
      onSnapshot(venueReff, (snapshot) => {
        var venueArray = snapshot.data()['Venue']
        if (totalBookings >= venueArray.length) {
          option.disabled = true
        }
      })


      select.add(option);
    });

    // Create a new container element
    let container = document.createElement("div");

    // Create a new label element
    let timingLabel = document.createElement("label");
    timingLabel.id = "TimingLabel"

    // Set the text content of the label
    timingLabel.textContent = "Available Timing";

    // Create a new label element
    let slotLabel = document.createElement("label");
    slotLabel.id = "AddSlotLabel"
    slotLabel.style.fontWeight = "normal";
    slotLabel.style.fontSize = 15;

    // Set the text content of the label
    slotLabel.textContent = "(add more slots on the following page): ";

    // Append the label and select elements to the container
    container.appendChild(timingLabel);
    container.appendChild(slotLabel);
    container.appendChild(select);

    let inputContainer = document.getElementById('InputContainer');

    // Append the container element to the page
    inputContainer.appendChild(container);
    // Get the select element by its ID

    var selectTiming = document.getElementById("SelectTiming");
    // var selectedTiming = selectTiming.value;

    // if (selectedTiming != "Select an option"){
    //   showVenue(venue, day, selectedTiming)
    // }

    selectTiming.onchange = function () {
      var selectTiming = document.getElementById("SelectTiming");
      var selectedTiming = selectTiming.value;
      var previousVenueSelect = document.getElementById("SelectVenue");
      if (previousVenueSelect != null) {
        let parentElement = previousVenueSelect.parentNode;
        let labelElement = document.getElementById("VenueLabel");
        parentElement.removeChild(previousVenueSelect);
        labelElement.remove()
      }
      if (selectedTiming != "Select an option") {
        showVenue(venue, day, selectedTiming)
      }
    }

  })
}

function showVenue(venue, day, selectedTiming) {

  var previousVenueSelect = document.getElementById("SelectVenue");
  if (previousVenueSelect != null) {
    let parentElement = previousVenueSelect.parentNode;
    let labelElement = document.getElementById("VenueLabel");
    parentElement.removeChild(previousVenueSelect);
    labelElement.remove()
  }

  var venueRef = doc(db, 'AvailableTiming', venue, day, selectedTiming)
  onSnapshot(venueRef, (snapshot) => {

    var availableVenue = snapshot.data()['Venue']
    var selectVenue = document.createElement("select");
    selectVenue.id = "SelectVenue"

    // Create a default option with placeholder text
    let defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.text = "Select an option";

    // Append the default option to the select element
    selectVenue.appendChild(defaultOption);

    availableVenue.forEach(function (optionText) {
      let option = document.createElement("option");
      option.text = optionText;

      if (bookedVenue && bookedVenue[optionText]) {
        let bookedArray = bookedVenue[optionText]
        if (bookedArray.includes(selectedTiming)) {
          option.disabled = true
        }
      }

      selectVenue.add(option);
    }
    );
    // Create a new container element
    let container = document.createElement("div");

    // Create a new label element
    let venueLabel = document.createElement("label");
    venueLabel.id = "VenueLabel"

    // Set the text content of the label
    venueLabel.textContent = "Table: ";

    // Append the label and select elements to the container
    container.appendChild(venueLabel);
    container.appendChild(selectVenue);

    let inputContainer = document.getElementById('InputContainer');

    // Append the container element to the page
    inputContainer.appendChild(container);

    createSubmitButton();
  })
}

function createSubmitButton() {
  //check if button is generated 
  if (document.getElementById("SubmitButton")) {
    return;
  } else {
    // Create a new button element
    let submitButton = document.createElement("button");

    // Set the button text
    submitButton.innerText = "Submit";

    // Set the button ID
    submitButton.id = "SubmitButton";

    // Add an event listener for the "click" event
    submitButton.addEventListener("click", function () {
      // Set data
      let date = dateSelected
      let selectVenue = document.getElementById("mySelect");
      let venueType = selectVenue.options[selectVenue.selectedIndex].value;
      let venue = document.getElementById("SelectVenue").value
      let selectTiming = document.getElementById("SelectTiming");
      let time = selectTiming.value;

      console.log(venueType)

      submitBooking(date, venueType, venue, time)
    });

    var buttonContainer = document.getElementById("SubmitButtonContainer");

    // Add the button to the HTML document
    buttonContainer.appendChild(submitButton);
  }

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


function generateCarousel(imageUrls) {
  // Get the carousel-inner element
  const carouselInner = document.querySelector('.carousel-inner');

  while (carouselInner.firstChild) {
    carouselInner.removeChild(carouselInner.firstChild);
  }

  // Loop through the imageUrls array to create carousel items and set image URLs
  imageUrls.forEach((imageUrl, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');

    // Set the 'active' class for the first item
    if (index === 0) {
      carouselItem.classList.add('active');
    }

    const imgElement = document.createElement('img');
    imgElement.classList.add('d-block', 'w-100');
    imgElement.alt = '...';
    imgElement.src = imageUrl;

    carouselItem.appendChild(imgElement);
    carouselInner.appendChild(carouselItem);
  });

  // Check if there's only one image, and hide the carousel controls accordingly
  const carouselControls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
  if (imageUrls.length <= 1) {
    carouselControls.forEach(control => control.style.display = 'none');
  } else {
    carouselControls.forEach(control => control.style.display = 'block');
  }

}
