let questions = [
    {
        question: "Which age ranges do you teach?",
        options: [
            "Primary (5-10)",
            "Secondary (10-16)",
            "Adult (16+)",
        ],
        questionType: "multipleSelect",
        answeredByUser:[],
    },
    {
        question: "Can your learners sign up and activate their learning materials independently?",
        options: [
            "Yes",
            "No",
        ],
        questionType: "multipleChoice",
        answeredByUser:[],
    },
    {
        question: "Do you want to create your classes one by one or in bulk?",
        options: [
            "One By One",
            "Bulk",
        ],
        questionType: "multipleChoice",
        answeredByUser:[],
    },
    {
        question: "Would you find it useful to be able to copy form an existing class when creating new classes?",
        options: [
            "Yes",
            "No",
        ],
        questionType: "multipleChoice",
        answeredByUser:[],
    },
    {
        question: "Do you want to use default grading scales or create your own grading scales?",
        options: [
            "Use Default",
            "Create my own",
        ],
        questionType: "multipleChoice",
        answeredByUser:[],
    },
    {
        question: "Would you like to run a report that includes several classes?",
        options: [
            "Yes",
            "No",
        ],
        questionType: "multipleChoice",
        answeredByUser:[],
    }
];

let currentIndex = 0; // Track the current question index
const questionsPerPage = 2; // Show only 2 questions at a time
let nextBtn = document.querySelector(".next");
let backBtn = document.querySelector(".back");
let questionCard = document.querySelector(".question-list");
let mcqBtn;
let checkboxBtn;

// Function to render questions and restore previous answers
function renderQuestions() {
    questionCard.innerHTML = ""; // Clear previous questions
    
    for (let i = currentIndex; i < currentIndex + questionsPerPage && i < questions.length; i++) {
        const currentQuestion = questions[i];
        
        if (currentQuestion.questionType === "multipleSelect") {
            // Create the multipleSelect question
            let optionsHtml = '';
            currentQuestion.options.forEach((option, optIndex) => {
                const isChecked = currentQuestion.answeredByUser.includes(option) ? 'checked' : '';
                const optionId = `option-${i}-${optIndex}`;
                
                optionsHtml += `
                    <div class="options options${optIndex + 1}">
                        <input
                            type="checkbox"
                            class="styled-checkbox"
                            name="question-${i}"
                            id="${optionId}"
                            data-question="${i}"
                            data-option="${option}"
                            ${isChecked}
                        />
                        <label for="${optionId}">${option}</label><br />
                    </div>
                `;
            });
            
            let questionHtml = `
                <li>
                    <div class="question question1">
                        <span>${currentQuestion.question}</span>
                        <p>Select all that apply</p>
                        <form action="" id="quiz-form-${i}">
                            <div class="option-list">
                                ${optionsHtml}
                            </div>
                        </form>
                    </div>
                </li>
            `;
            questionCard.innerHTML += questionHtml;
        } else {
            // Create the multipleChoice question
            let questionHtml = `
                <li>
                    <div class="question">
                        <div class="question2">
                            ${currentQuestion.question}
                        </div>
                        <div class="btn-container">
                            <button type="button" class="btn yes-btn ${currentQuestion.answeredByUser.includes(currentQuestion.options[0]) ? 'active' : ''}" 
                                data-group="${i}" 
                                value="${currentQuestion.options[0]}">
                                ${currentQuestion.options[0]}
                            </button>
                            <button type="button" class="btn no-btn ${currentQuestion.answeredByUser.includes(currentQuestion.options[1]) ? 'active' : ''}" 
                                data-group="${i}" 
                                value="${currentQuestion.options[1]}">
                                ${currentQuestion.options[1]}
                            </button>
                        </div>
                    </div>
                </li>
            `;
            questionCard.innerHTML += questionHtml;
        }
    }
    
    // Update button states based on current position
    updateNavigationButtons();
    
    // Attach event listeners to the new elements
    attachEventListeners();
}

// Function to attach event listeners to the elements after rendering
function attachEventListeners() {
    // Add click event listeners to MCQ buttons
    mcqBtn = document.querySelectorAll(".btn");
    mcqBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            SelectedButton(event.target);
        });
    });
    
    // Add change event listeners to checkboxes
    checkboxBtn = document.querySelectorAll('.styled-checkbox');
    checkboxBtn.forEach((cb) => {
        cb.addEventListener('change', (event) => {
            const questionIndex = parseInt(event.target.getAttribute('data-question'));
            const optionValue = event.target.getAttribute('data-option');
            
            if (event.target.checked) {
                if (!questions[questionIndex].answeredByUser.includes(optionValue)) {
                    questions[questionIndex].answeredByUser.push(optionValue);
                }
            } else {
                questions[questionIndex].answeredByUser = questions[questionIndex].answeredByUser.filter(item => item !== optionValue);
            }
            
            // Update button state
            updateNavigationButtons();
        });
    });
}

// Function to update navigation button states
function updateNavigationButtons() {
    // Update Next button
    if (currentIndex + questionsPerPage >= questions.length) {
        nextBtn.innerHTML = "Finish <i class='fa-solid fa-angle-right'></i>";
    } else {
        nextBtn.innerHTML = "Next <i class='fa-solid fa-angle-right'></i>";
    }
    
    // Check if any questions on the current page have been answered
    let currentPageHasAnswers = false;
    for (let i = currentIndex; i < currentIndex + questionsPerPage && i < questions.length; i++) {
        if (questions[i].answeredByUser.length > 0) {
            currentPageHasAnswers = true;
            break;
        }
    }
    
    // Enable/disable Next button based on answers
    nextBtn.disabled = !currentPageHasAnswers;
    
    // Update Back button
    backBtn.parentElement.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
}

// Function to handle MCQ button selection
function SelectedButton(selectBtn) {
    const group = selectBtn.getAttribute('data-group');
    mcqBtn.forEach((btn) => {
        if (btn.getAttribute('data-group') === group) {
            btn.classList.remove('active');
        }
    });
    
    selectBtn.classList.add("active");
    questions[group].answeredByUser = [selectBtn.innerHTML];
    
    // Update button state
    updateNavigationButtons();
}

// Next button event listener
nextBtn.addEventListener("click", () => {
    if (currentIndex + questionsPerPage < questions.length) {
        currentIndex += questionsPerPage; // Move to the next set of questions
        renderQuestions(); // Re-render questions
        
        // Update progress bar
        updateProgressBar();
    }
});

// Back button event listener


document.querySelector(".back-btn").addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex -= questionsPerPage; // Move to the previous set of questions
        renderQuestions(); // Re-render questions with previous answers
        
        // Update progress bar
        updateProgressBar();
    }
});

// Function to update progress bar
function updateProgressBar() {
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const currentPage = Math.floor(currentIndex / questionsPerPage) + 1;
    const progressPercentage = (currentPage / totalPages) * 100;
    
    document.querySelector(".progress-line.l1").style.width = progressPercentage >= 33 ? "100%" : `${progressPercentage * 3}%`;
    document.querySelector(".progress-line.l2").style.width = progressPercentage >= 66 ? "100%" : progressPercentage <= 33 ? "0%" : `${(progressPercentage - 33) * 3}%`;
    document.querySelector(".progress-line.l3").style.width = progressPercentage >= 100 ? "100%" : progressPercentage <= 66 ? "0%" : `${(progressPercentage - 66) * 3}%`;
}

// Initialize the quiz
renderQuestions();
updateProgressBar();

// Close button event listener
document.querySelector(".fa-xmark").addEventListener("click", () => {
    // Add your close functionality here
    console.log("Close button clicked");
});