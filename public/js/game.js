const apiUrl = "https://opentdb.com/api.php?amount=20&type=multiple";
const question = document.querySelector('#questionHeader');
const answerButtons = document.getElementById('quizOptions');
const app = document.querySelector('.app');
const restartButton = document.querySelector('.Restart');
const logoutButton = document.querySelector('.logout');
const quizGrade = document.querySelector('#grade');
const startQuestion = document.getElementById('start');
const endQuestion = document.getElementById('end');

let score = 0;
const MAX_QUIZ = 20;
let currentQuestionIndex = 0;
let newArray = [];


async function fetchData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function processData() {
    resetState();
    const apiData = await fetchData();
    
    for(let i = 0; i < MAX_QUIZ; i++) {
        let formerFirst = apiData.results[i].incorrect_answers;
        let firstOptions = [...formerFirst, apiData.results[i].correct_answer].sort(() => Math.random() - 0.5); // Shuffle options

        const items = {
            question: apiData.results[i].question,
            difficulty: apiData.results[i].difficulty,
            options: firstOptions.map(option => ({
                text: option,
                correct: option === apiData.results[i].correct_answer
            })),
            answer: apiData.results[i].correct_answer
        }
        newArray.push(items);
    }

    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuizData = newArray[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    question.innerHTML = currentQuizData.question;
    difficulty = currentQuizData.difficulty;
    startQuestion.innerHTML = questionNo;
    endQuestion.innerHTML = MAX_QUIZ;

    if(difficulty == 'easy'){
        document.getElementById("easy").style.backgroundColor = "green";
        document.getElementById("easy").style.borderColor = "green";
        document.getElementById("medium").style.backgroundColor = "black";
        document.getElementById("medium").style.borderColor = "black";
        document.getElementById("hard").style.backgroundColor = "black";
        document.getElementById("hard").style.borderColor = "black";
    }else if(difficulty == 'medium'){
        document.getElementById("easy").style.backgroundColor = "black";
        document.getElementById("easy").style.borderColor = "black";
        document.getElementById("medium").style.backgroundColor = "orange";
        document.getElementById("medium").style.borderColor = "orange";
        document.getElementById("hard").style.backgroundColor = "black";
        document.getElementById("hard").style.borderColor = "black"
    } else if(difficulty == 'hard'){
        document.getElementById("easy").style.backgroundColor = "black";
        document.getElementById("easy").style.borderColor = "black";
        document.getElementById("medium").style.backgroundColor = "black";
        document.getElementById("medium").style.borderColor = "black";
        document.getElementById("hard").style.backgroundColor = "red";
        document.getElementById("hard").style.borderColor = "red"
    };
    timeChecker(difficulty);
    currentQuizData.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.innerHTML = option.text;
        if (option.correct) {
            button.dataset.correct = option.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtons.appendChild(button);
    });

}
function nextQuestion(){
    currentQuestionIndex++;
    if (currentQuestionIndex < MAX_QUIZ) {
        showQuestion();
    } else {
        if(score <= 6){
            window.location.href = '/mark35';
        } else if(score == 7 && score <= 10){
            window.location.href = '/mark50';
        } else if(score == 11 && score <= 12){
            window.location.href = '/mark60';
        } else{
            window.location.href = '/mark75';
        }
    };

};


function resetState() {
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('incorrect');
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
    });

    setTimeout(() => {
        nextQuestion();
    }, 1000);
}


let countdownTimer;
function timeChecker(level) {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    let timeLeft;

    if (level == 'easy') {
        timeLeft = 30;
    } else if (level == 'medium') {
        timeLeft = 40;
    } else if (level == 'hard') {
        timeLeft = 60;
    }
    countdownTimer = setInterval(function () {
        document.getElementById("time").innerHTML = timeLeft;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdownTimer);
            nextQuestion();
        }
    }, 1000);
}


processData();