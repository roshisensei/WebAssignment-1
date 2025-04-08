

let questions = [
    {
        question: "Which age ranges do you teach?",
        options: [
            "Primary (5-10)",
            "Secondary (10-16)",
            "Adult (16+)",
        ],
        questionType: "multipleSelect",
        answeredByUser: [],
    },
    {
        question: "Can your learners sign up and activate their learning materials independently?",
        options: [
            "Yes",
            "No",
        ],
        questionType: "multipleChoice",
        answeredByUser: [],
    },
    {
        question: "Do you want to create your classes one by one or in bulk?",
        options: [
            "One By One",
            "Bulk",
        ],
        questionType: "multipleChoice",
        answeredByUser: [],
    },
    {
        question: "Would you find it useful to be able to copy form an existing class when creating new classes?",
        options: [
            "Yes",
            "No",
        ],
        questionType: "multipleChoice",
        answeredByUser: [],
    },
    {
        question: "Do you want to use default grading scales or create your own grading scales?",
        options: [
            "Use Default",
            "Create my own",
        ],
        questionType: "multipleChoice",
        answeredByUser: [],
    },
    {
        question: "Would you like to run a report that includes several classes?",
        options: [
            "Yes",
            "No",
        ],
        questionType: "multipleChoice",
        answeredByUser: [],
    }
]



let checkbox = document.querySelectorAll(".styled-checkbox");
let nextBtn = document.querySelector(".next");
let backBtn = document.querySelector(".back-btn");
let questionCard = document.querySelector(".question-list");


let mcqBtn;

let currentIndex = 0; // Track the current question index
const questionsPerPage = 2; // Show only 2 questions at a time
let checkboxBtn;

function setupCheckboxListeners() {
    const checkboxBtns = document.querySelectorAll('.styled-checkbox');

    checkboxBtns.forEach((cb) => {
        cb.addEventListener('change', (event) => {
            const optionValue = event.target.nextElementSibling.innerText;  // Get the label text

            const multiSelectQuestion = questions[0];

            if (event.target.checked) {
                // Add the option if checked and not already in the array
                if (!multiSelectQuestion.answeredByUser.includes(optionValue)) {
                    multiSelectQuestion.answeredByUser.push(optionValue);
                }
            } else {
                // Remove the option if unchecked
                multiSelectQuestion.answeredByUser = multiSelectQuestion.answeredByUser
                    .filter(item => item !== optionValue);
            }
            updateNextButtonState();
        });
    });
}
function renderQuestions() {
    questionCard.innerHTML = ""; // Clear previous questions
    for (let i = currentIndex; i < currentIndex + questionsPerPage && i < questions.length; i++) {
        let questionHtml = questions[i].questionType === "multipleSelect" ? `<li>
              <div class="question question1">
                <span>${questions[i].question} </span>
                <p>Select all that apply</p>
                <form action="" id="quiz-form">
                  <div class="option-list">
                    <div class="options options1">
                      <input
                        type="checkbox"
                        class="styled-checkbox"
                        name=""
                        id="primary"
                      />
                      <label for="primary">${questions[i].options[0]}</label>
                    </div>
                    <div class="options options2">
                      <input
                        type="checkbox"
                        class="styled-checkbox"
                        name=""
                        id="Secondary"
                      />
                      <label for="Secondary">${questions[i].options[1]}</label><br />
                    </div>
                    <div class="options options3">
                      <input
                        type="checkbox"
                        class="styled-checkbox"
                        name=""
                        id="adult"
                      />
                      <label for="adult">${questions[i].options[2]}</label><br />
                    </div>
                  </div>
                </form>
                </div>
              </li>`
            :
            `
                    <li>
                        <div class="question">
                            <div class="question2">
                                ${questions[i].question}
                            </div>
                            <div class="btn-container">
                                <button type="button" class="btn yes-btn" data-group="${i}" value="${questions[i].options[0]}">${questions[i].options[0]}</button>
                                <button type="button" class="btn no-btn" data-group="${i}" value="${questions[i].options[1]}">${questions[i].options[1]}</button>
                            </div>
                        </div>
                    </li>
                `;
        questionCard.innerHTML += questionHtml;


    }


    // Disable "Next" button if no more questions left
    if (currentIndex + questionsPerPage >= questions.length) {
        nextBtn.innerHTML = "finish";

    } else {
        nextBtn.removeAttribute("disabled");
    }

    mcqBtn = document.querySelectorAll(".btn");
    mcqBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            SelectedButton(event.target);
        });
    })

    setupCheckboxListeners();
    selectedAnswer(currentIndex);
    updateNextButtonState();



}



// Show initial questions
renderQuestions();
updateNextButtonState();

function isAllAnswered() {
    for (let i = currentIndex; i < currentIndex + questionsPerPage && i < questions.length; i++) {
        if (questions[i].answeredByUser.length === 0) {
            return false;
        }
    }
    return true;
}

function updateNextButtonState() {
    if (isAllAnswered()) {
        nextBtn.removeAttribute('disabled');
    } else {
        nextBtn.setAttribute('disabled', 'true');
    }
}


// "Next" button event listener
nextBtn.addEventListener("click", () => {
    if (currentIndex + questionsPerPage < questions.length) {
        currentIndex += questionsPerPage; // Move to the next set of questions
        renderQuestions();
        updateNextButtonState();
        selectedAnswer(currentIndex);
    } else {
        questions.forEach((qn, idx) => {

            console.log( qn.answeredByUser);
            // console.log(questions);
        })
    }
});
// "Back" button event listener
backBtn.addEventListener("click", () => {

    if (currentIndex - questionsPerPage >= 0) {
        currentIndex -= questionsPerPage; // Move to the next set of questions
        renderQuestions(); // Re-render questions
        selectedAnswer(currentIndex);
        nextBtn.innerHTML = 'next';
    }
});


mcqBtn = document.querySelectorAll(".btn");

// Make Yes and No button behave like radio button
function SelectedButton(selectBtn) {
    const group = selectBtn.getAttribute('data-group');
    mcqBtn.forEach((btn) => {
        if (btn.getAttribute('data-group') === group) {
            btn.classList.remove('active');
            questions[group].answeredByUser = [];
        }
    });
    selectBtn.classList.add("active");
    questions[group].answeredByUser.push(selectBtn.innerHTML);
    updateNextButtonState();
}

function selectedAnswer(currIdx) {

    for (let i = currIdx; i < currIdx + questionsPerPage; i++) {
        if (questions[i].questionType === 'multipleChoice') {
            const questionButtons = document.querySelectorAll(`button[data-group="${i}"]`);
            questionButtons.forEach((btn) => {
                if (questions[i].answeredByUser.includes(btn.innerText)) {
                    btn.classList.add('active');
                }
            });
        }
        else if (questions[i].questionType === 'multipleSelect') {
            const checkboxes = document.querySelectorAll('.styled-checkbox');
            checkboxes.forEach((checkbox) => {
                const optionText = checkbox.nextElementSibling.innerText;
                checkbox.checked = questions[i].answeredByUser.includes(optionText);
            });
        }

    }
}




