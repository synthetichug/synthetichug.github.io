
// Variables
const quizContainer = document.getElementById("quiz");
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById("submit");

// Kick things off
buildQuiz();
animateIcon();
setInterval(animateIcon, 5000);

// Pagination
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

// Show the first slide
showSlide(currentSlide);

// Event listeners
submitButton.addEventListener("click", showResults);
previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);



function buildQuiz() {
  // variable to store the HTML output
  const output = [];

  // for each question...
  myQuestions.forEach((currentQuestion, questionNumber) => {
    // variable to store the list of possible answers
    const answers = [];

    // and for each available answer...
    for (letter in currentQuestion.answers) {
      // ...add an HTML radio button
      answers.push(
        `<label>
          <input type="radio" name="question${questionNumber}" value="${letter}">
          ${letter} :
          ${currentQuestion.answers[letter]}
          </label>`
      );
    }

    // add this question and its answers to the output
    output.push(
      `<div class="slide">
        <div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>
        <div class="explaination" style='visibility: hidden'> ${
          currentQuestion.explaination
        } </div>
        </div>`
    );
  });
  // finally combine our output list into one string of HTML and put it on the page
  quizContainer.innerHTML = output.join("");
}

function move(){
		var i = 0;
		if (i == 0) {
			i = 1;
			var elem = document.getElementById("myBar");
			var width = 10;
			var id = setInterval(frame, 10);

			function frame() {
				if (width >= 100){
					clearInterval(id);
					i = 0;
				}
				else {
					width++;
					elem.style.width = width + "%";
					elem.innerHTML = width + "%";
				}
			}
		}
}

function animateIcon() {
  var a;
  a = document.getElementById("bannerIcon");
  a.innerHTML = "&#xf244;";
  setTimeout(function () {
    a.innerHTML = "&#xf243;";
  }, 1000);
  setTimeout(function () {
    a.innerHTML = "&#xf242;";
  }, 2000);
  setTimeout(function () {
    a.innerHTML = "&#xf241;";
  }, 3000);
  setTimeout(function () {
    a.innerHTML = "&#xf240;";
  }, 4000);
}

function showResults() {
  // gather answer containers from our quiz
  const answerContainers = quizContainer.querySelectorAll(".answers");
  const explainContainers = quizContainer.querySelectorAll(".explaination");

  // keep track of user's answers
  let numCorrect = 0;

  // for each question...
  myQuestions.forEach((currentQuestion, questionNumber) => {
    // find selected answer
    const answerContainer = answerContainers[questionNumber];
    const explainContainer = explainContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    // if answer is correct
    if (userAnswer === currentQuestion.correctAnswer) {
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      answerContainer.style.color = "#00AAF0";
    }

    // if answer is wrong or blank
    else if (userAnswer !== currentQuestion.correctAnswer) {
      // color the answers red
      answerContainers[questionNumber].style.color = "red";
      explainContainers[questionNumber].style.visibility = "visible";
    }
  });
  // show number of correct answers out of total
  resultsContainer.innerHTML = `<div class="frac"><span>${numCorrect}</span><span class="symbol">/</span><span class="bottom">${myQuestions.length}</span></div>`;
  //resultsContainer.innerHTML = `<sup>${numCorrect}</sup>&frasl;<sub>${myQuestions.length}</sub>`;
}

function showSlide(n) {
  slides[currentSlide].classList.remove("active-slide");
  slides[n].classList.add("active-slide");
  currentSlide = n;
  if (currentSlide === 0) {
    previousButton.style.display = "none";
  } else {
    previousButton.style.display = "inline-block";
  }
  if (currentSlide === slides.length - 1) {
    nextButton.style.display = "none";
    submitButton.style.display = "inline-block";
  } else {
    nextButton.style.display = "inline-block";
    submitButton.style.display = "none";
  }
}

function showNextSlide() {
  showSlide(currentSlide + 1);
  move();
}

function showPreviousSlide() {
  showSlide(currentSlide - 1);
}