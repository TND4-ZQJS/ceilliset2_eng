let currentQuestion = 1;
let questions = [];
let score = 0;

fetch('ceilli3mock_65.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadProgress();
    displayQuestion(currentQuestion);
  });

function displayQuestion(num) {
  const q = questions[num - 1];
  if (!q) return;

  document.getElementById('question-number').innerText = `Question ${q.questionNumber}`;
  document.getElementById('question-text').innerText = q.question;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  for (let key in q.options) {
    const btn = document.createElement('button');
    btn.textContent = `${key}. ${q.options[key]}`;
    btn.className = 'option';
    btn.disabled = false;

    const savedAnswer = localStorage.getItem(`answer_${num}`);
    if (savedAnswer) {
      btn.disabled = true;
      btn.classList.add('disabled');
      if (key === q.answer) btn.classList.add('correct');
      if (key === savedAnswer && savedAnswer !== q.answer) btn.classList.add('incorrect');
    }

    btn.onclick = () => checkAnswer(btn, key, q.answer);
    optionsContainer.appendChild(btn);
  }

  document.getElementById('feedback').innerText = '';
  updateScoreDisplay();
}

function checkAnswer(button, selected, correct) {
  const buttons = document.querySelectorAll('#options-container button');
  buttons.forEach(btn => {
    btn.classList.add('disabled');
    btn.disabled = true;
    if (btn.innerText.startsWith(`${correct}.`)) {
      btn.classList.add('correct');
    }
    if (btn.innerText.startsWith(`${selected}.`) && selected !== correct) {
      btn.classList.add('incorrect');
    }
  });

  document.getElementById('feedback').innerText = `Correct answer: ${correct}`;

  const previous = localStorage.getItem(`answer_${currentQuestion}`);
  if (!previous) {
    if (selected === correct) score++;
    localStorage.setItem('score', score);
  }

  localStorage.setItem(`answer_${currentQuestion}`, selected);
  updateScoreDisplay();
}

function nextQuestion() {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    displayQuestion(currentQuestion);
  }
}

function prevQuestion() {
  if (currentQuestion > 1) {
    currentQuestion--;
    displayQuestion(currentQuestion);
  }
}

function goToQuestion() {
  const num = parseInt(document.getElementById('jump-input').value);
  if (num >= 1 && num <= questions.length) {
    currentQuestion = num;
    displayQuestion(currentQuestion);
  } else {
    alert(`Please enter a valid question number (1–${questions.length})`);
  }
}

function updateScoreDisplay() {
  const totalAnswered = questions.filter((_, i) =>
    localStorage.getItem(`answer_${i + 1}`)
  ).length;
  document.getElementById('score-display').innerText = `Score: ${score} / ${totalAnswered}`;
}

function loadProgress() {
  const savedScore = localStorage.getItem('score');
  if (savedScore !== null) {
    score = parseInt(savedScore);
  }
}

function resetProgress() {
  if (confirm('Are you sure you want to clear all your answers and restart?')) {
    localStorage.clear();
    score = 0;
    currentQuestion = 1;
    displayQuestion(currentQuestion);
  }
}
