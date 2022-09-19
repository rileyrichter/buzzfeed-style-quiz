const resultsButton = document.querySelector("#resultsbutton");

const questionOne = document
  .querySelector("#questionOne")
  .querySelectorAll("a");
const questionTwo = document
  .querySelector("#questionTwo")
  .querySelectorAll("a");
const questionThree = document
  .querySelector("#questionThree")
  .querySelectorAll("a");
const questionFour = document
  .querySelector("#questionFour")
  .querySelectorAll("a");

let allQuestions = Array.prototype.concat.call(
  ...questionOne,
  ...questionTwo,
  ...questionThree,
  ...questionFour
);

window.addEventListener("load", (event) => {
  allQuestions.forEach((question) => {
    question.addEventListener("click", setResponse);
  });
  resultsButton.addEventListener("click", getCharachter);
});

function setResponse() {
  localStorage.setItem(
    this.getAttribute("data-question"),
    this.getAttribute("data-answer")
  );
}

function getCharachter() {
  document.querySelector("#getresultswrapper").remove();
  document.querySelector("#loading").style.display = "block";
  const handleError = (response) => {
    if (!response.ok) {
      throw Error(` ${response.status} ${response.statusText}`);
    } else {
      return response.json();
    }
  }; //handler function that throws any encountered error
  let answerOne = Number(localStorage.getItem("answerOne"));
  let answerTwo = Number(localStorage.getItem("answerTwo"));
  let answerThree = Number(localStorage.getItem("answerThree"));
  let answerFour = Number(localStorage.getItem("answerFour"));
  fetch("https://bparker.api.stdlib.com/lasso-quiz-new@dev/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Answer1: answerOne,
      Answer2: answerTwo,
      Answer3: answerThree,
      Answer4: answerFour,
    }),
  })
    .then(handleError) // skips to .catch if error is thrown
    .then((data) => {
      let contentTarget = document.getElementById("result-target");
      let youAre = document.createElement("p");
      youAre.setAttribute("class", "result-name");
      youAre.textContent = "You are " + data.result_send;
      contentTarget.appendChild(youAre);
      let yourImage = document.createElement("img");
      yourImage.setAttribute("src", data.result_image);
      yourImage.setAttribute(
        "alt",
        data.result_send + "from the TV show Ted Lasso"
      );
      yourImage.setAttribute("class", "result-image");
      contentTarget.appendChild(yourImage);
      let yourDescription = document.createElement("p");
      yourDescription.setAttribute("class", "result-description");
      yourDescription.textContent = data.result_description;
      contentTarget.appendChild(yourDescription);
    })
    .catch(function writeError(err) {
      // catches the error and logs it
      console.log(err);
    })
    .finally(() => {
      localStorage.clear();
      document.querySelector("#loading").remove();
    });
}
