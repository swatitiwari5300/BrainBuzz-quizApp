let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const startBtn = document.getElementById("startBtn");
const quizCard = document.getElementById("quizCard");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    quizCard.style.display = "block";
    await fetchQuestions();
    loadQuestion();
});

async function fetchQuestions() {
    try {
        const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
        const data = await res.json();

        questions = data.results.map(q => {
            const options = [...q.incorrect_answers];
            const correctIndex = Math.floor(Math.random() * 4);
            options.splice(correctIndex, 0, q.correct_answer);

            return {
                question: decodeHTML(q.question),
                options: options.map(opt => decodeHTML(opt)),
                answer: decodeHTML(q.correct_answer)
            };
        });

    } catch (error) {
        questionEl.textContent = "Failed to load questions. Please try again.";
        console.error(error);
    }
}

function decodeHTML(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else if (nextBtn.textContent === "Restart Quiz") {
        // Restart the quiz after completion
        currentQuestionIndex = 0;
        score = 0;
        scoreEl.textContent = score;
        nextBtn.textContent = "Next";
    
        fetchQuestions().then(() => {
            loadQuestion();
        });
    } else {
        // Quiz just got completed, show final message
        questionEl.textContent = "Quiz Complete 🎉";
        optionsEl.innerHTML = "";
        nextBtn.textContent = "Restart Quiz";
        nextBtn.style.display = "inline-block";
    }
});


function loadQuestion() {
    const currentQ = questions[currentQuestionIndex];
    questionEl.textContent = currentQ.question;
    optionsEl.innerHTML = "";
    nextBtn.style.display = "none";

    currentQ.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.classList.add("option-btn");
        btn.onclick = () => selectOption(option, currentQ.answer, btn);
        optionsEl.appendChild(btn);
    });
    document.getElementById("progress").textContent = 
  `Question ${currentQuestionIndex + 1} of ${questions.length}`;

}

function selectOption(selected, correct, btn) {
    const allButtons = document.querySelectorAll(".option-btn");
    allButtons.forEach(b => {
        b.disabled = true;
        b.style.backgroundColor = "#f0f0f0";
    });

    if (selected === correct) {
        btn.classList.add("correct");
        btn.style.backgroundColor = "#4CAF50"; // green
        score++;
        scoreEl.textContent = score;
    } else {
        btn.classList.add("wrong");
        btn.style.backgroundColor = "#f44336"; // red
    }

    nextBtn.style.display = "inline-block";
}
