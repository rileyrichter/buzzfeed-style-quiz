// Let's set our global variables
const tweetButton = document.querySelector("#tweet");
const resultArea = document.querySelector("#result-area");
const resultWrapper = document.querySelector("#result-wrapper");
const loadingWrapper = document.querySelector("#loading-wrapper");
const submitButton = document.querySelector("#submit");
const againButton = document.querySelector("#again");
const questionTwo = document.querySelector("#two-wrapper");
const questionThree = document.querySelector("#three-wrapper");
const questionFour = document.querySelector("#four-wrapper");
const resultTarget = document.querySelector("#result");
const questionOneItems = document.querySelectorAll("#group-one > li");
const questionTwoItems = document.querySelectorAll("#group-two > li");
const questionThreeItems = document.querySelectorAll("#group-three > li");
const questionFourItems = document.querySelectorAll("#group-four > li");
const motionState = window.matchMedia("(prefers-reduced-motion: reduce)");
const resultName = document.querySelector("#result-name");
const resultImage = document.querySelector("#result-image");
const resultDescription = document.querySelector("#result-description");
const overviewGrid = document.querySelector("#overview-grid");
const overviewCell = document.querySelector("#overview-cell");
const hiddenDiv = document.querySelector("#hidden");
let myResult;

// On page load, let's do some work
window.onload = (event) => {
  // bind the tweetClick() function to the tweetButton
  tweetButton.addEventListener("click", tweetClick);
  // bind the doItAgain() function to the againButton
  againButton.addEventListener("click", doItAgain);
  // Get all the list items in question one
  // bind the toQuestionTwo() function to it
  questionOneItems.forEach((item) => {
    item.addEventListener("click", toQuestionTwo);
  });
  // Get all the list items in question two
  // bind the toQuestionThree() function to it
  questionTwoItems.forEach((item) => {
    item.addEventListener("click", toQuestionThree);
  });
  // Get all the list items in question three
  // bind the toQuestionFour() function to it
  questionThreeItems.forEach((item) => {
    item.addEventListener("click", toQuestionFour);
  });
  // Find out if prefers reduced motion is on
  // and log that to the console
  !0 === motionState.matches
    ? console.log("Reduce motion is on")
    : console.log("Reduce motion is off");
  getStats();
};

// Prevent the form from submitting
// so we can make our API call
// Side note: I normally don't use jQuery
// but this method is easiest when working
// with forms in Webflow and jQuery
$("#quiz-form").submit(function () {
  getCharacter();
  return false;
});

function getCharacter() {
  // Scroll to where the results will load
  respectMotionPreference(resultArea);
  // Fade out and remove the submit button
  fadeOut(submitButton);
  // Fade in the loading animation
  fadeIn(loadingWrapper);
  //handler function that throws any encountered error
  const handleError = (response) => {
    // If the response is not ok
    if (!response.ok) {
      // Throw an error with the response status and text
      throw Error(` ${response.status} ${response.statusText}`);
    } else {
      // Or, if no error, give us the data
      return response.json();
    }
  };

  // Get the value from question one and make it a number
  const answerOne = Number(
    document.querySelector('input[name="one"]:checked').value
  );
  // Get the value from question two and make it a number
  const answerTwo = Number(
    document.querySelector('input[name="two"]:checked').value
  );
  // Get the value from question three and make it a number
  const answerThree = Number(
    document.querySelector('input[name="three"]:checked').value
  );
  // Get the value from question four and make it a number
  const answerFour = Number(
    document.querySelector('input[name="four"]:checked').value
  );
  // Start our fetch (API call) the URL is our endpoint
  fetch("https://bparker.api.stdlib.com/lasso-quiz-new@dev/", {
    // Define our method and headers
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // Set our body which is the data we're sending to Airtable
    body: JSON.stringify({
      Answer1: answerOne,
      Answer2: answerTwo,
      Answer3: answerThree,
      Answer4: answerFour,
    }),
  })
    // Skips to .catch if error is thrown
    .then(handleError)
    // If there is no error, let's work with the data
    .then((data) => {
      // Here we set a variable with data returned from our API call
      myResult = data.result_send;
      // Here we set attributes for an image
      // First we set the src for the image
      resultImage.setAttribute("src", data.result_image);
      // Then we set the alt text
      resultImage.setAttribute(
        "alt",
        `${data.result_send} from the TV show Ted Lasso`
      );
      // Put the result from Airtable in our span
      // that's holding results in Webflow
      resultName.innerText = data.result_send;
      // Put the result description from Airtable
      // in our paragraph that's holding results in Webflow
      resultDescription.innerText = data.result_description;
    })
    .catch(function writeError(err) {
      // Catches the error and logs it
      console.log(err);
    })
    .finally(() => {
      // Fade the loading animation out
      fadeOut(loadingWrapper);
      // Fade in the results
      fadeIn(resultWrapper);
      // Scroll to results
      respectMotionPreference(resultArea);
      // Focus on the results wrapper --
      // we do this to make sure results are
      // easily accessible for folks using a
      // screenreader
      resultWrapper.setAttribute("tabindex", "-1");
      resultWrapper.focus();
    });
}

// Function to fade an element in
function fadeIn(e) {
  e.parentElement.style.display = "block";
  setTimeout(() => {
    e.classList.remove("fade");
  }, 300);
}

// Function to fade an element out and remove it
function fadeOut(e) {
  e.classList.add("fade");
  setTimeout(() => {
    e.remove();
  }, 300);
}

// Function that will scroll based on a
// users reduce motion preference.
// Always think about accessibility!
function respectMotionPreference(e) {
  !0 === motionState.matches
    ? e.scrollIntoView({ block: "start" })
    : e.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Scroll to question two
function toQuestionTwo() {
  respectMotionPreference(questionTwo);
}

// Scroll to question three
function toQuestionThree() {
  respectMotionPreference(questionThree);
}

// Scroll to question four
function toQuestionFour() {
  respectMotionPreference(questionFour);
}

// Function that sets the scroll
// position to the top of the page
// then reloads the page
function doItAgain() {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  window.location = "https://buzzfeed-style-quiz.webflow.io/";
}

// Function to share our result on Twitter
function tweetClick() {
  // Set the URL shared on Twitter to the current URL
  const shareURL = window.location.href;
  // Set the copy we'll share on Twitter
  const tweetCopy = `I took a Buzzfeed style quiz to find out which Ted Lasso character I am. I'm ${myResult}! You can take the quiz here:`;
  // Replace characters in this copy to work with Twitter's share capabilities
  const fixedCopy = tweetCopy
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/, "'");
  // Open a new window and add the copy and URL
  window.open(
    `https://twitter.com/share?url=${encodeURIComponent(
      shareURL
    )}&text=${encodeURIComponent(fixedCopy).replace(/'/g, "%27")}`
  );
}

// 👇👇👇 This code works on page load to show an overview of results

// Function to get the Airtable stats and write them to the results section
function getStats() {
  //handler function that throws any encountered error
  const handleError = (response) => {
    // If the response is not ok
    if (!response.ok) {
      // Throw an error with the response status and text
      throw Error(` ${response.status} ${response.statusText}`);
    } else {
      // Or, if no error, give us the data
      return response.json();
    }
  };

  // Start our fetch (API call) the URL is our endpoint
  fetch("https://bparker.api.stdlib.com/lasso-quiz-new@dev/airtable", {
    // Define our method and headers
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    // Skips to .catch if error is thrown
    .then(handleError)
    // If there is no error, let's work with the data
    .then((data) => {
      data.rows.forEach((row) => {
        // Set variables bases on the results from Airtable
        const chNumber = row.fields["Count (quiz)"];
        const chRollup = row.fields.Rollup;
        // Use our percentage function to calculate results
        const percentageResult = percentage(chNumber, chRollup);
        // Make a copy of the cell in the hidden div
        const newCell = overviewCell.cloneNode(true);
        // Pass the values through to the elements
        newCell.querySelector("#name").innerText = row.fields.Name;
        newCell.querySelector("#percent").innerText = percentageResult;
        // Add the cell to the grid
        overviewGrid.appendChild(newCell);
      });
    })
    .catch(function writeError(err) {
      // Catches the error and logs it
      console.log(err);
    })
    .finally(() => {
      // remove the hidden div
      hiddenDiv.remove();
    });
}

// Function to calculate the percentages for the overview
function percentage(partialValue, totalValue) {
  return Math.round((100 * partialValue) / totalValue);
}
