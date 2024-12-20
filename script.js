let currentSong = null;
let score = 0;
let songs = [];
let remainingSongs = [];
let questionCount = 0;
const MAX_QUESTIONS = 20;

document.getElementById("start-button").addEventListener("click", async () => {
  await loadSongs();
  initializeGame();
});

document.getElementById("submit-button").addEventListener("click", () => {
  const userAnswer = document.getElementById("answer").value.trim();
  if (!userAnswer) {
    alert("請輸入答案！");
    return;
  }
  checkAnswer(userAnswer);
});

document.getElementById("next-button").addEventListener("click", nextSong);

async function loadSongs() {
  try {
    const response = await fetch("songs.json");
    songs = await response.json();
    remainingSongs = [...songs].sort(() => Math.random() - 0.5).slice(0, MAX_QUESTIONS);
  } catch (error) {
    alert("無法載入題庫，請檢查 songs.json 是否正確！");
  }
}

function initializeGame() {
  score = 0;
  questionCount = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("question-counter").textContent = `${questionCount}/${MAX_QUESTIONS}`;
  document.getElementById("game-container").classList.remove("hidden");
  document.getElementById("start-button").classList.add("hidden");
  nextSong();
}

function nextSong() {
  if (remainingSongs.length === 0 || questionCount >= MAX_QUESTIONS) {
    alert(`遊戲結束！你的最終得分是：${score} 分`);
    resetGame();
    return;
  }
  
  questionCount++;
  document.getElementById("question-counter").textContent = `${questionCount}/${MAX_QUESTIONS}`;
  
  currentSong = remainingSongs.pop();
  document.getElementById("lyric").textContent = currentSong.lyric;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  
  // Show submit button, hide next button
  document.getElementById("submit-button").classList.remove("hidden");
  document.getElementById("next-button").classList.add("hidden");
}

function checkAnswer(userAnswer) {
  document.getElementById("submit-button").classList.add("hidden");
  
  if (userAnswer === currentSong.title) {
    score += 5;
    document.getElementById("feedback").textContent = "答對了！";
    document.getElementById("score").textContent = score;
  } else {
    document.getElementById("feedback").textContent = `答錯了！正確答案是：${currentSong.title}`;
  }
  
  // Only show next button if not the last question
  if (questionCount < MAX_QUESTIONS) {
    document.getElementById("next-button").classList.remove("hidden");
  }
}

function resetGame() {
  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("start-button").classList.remove("hidden");
  document.getElementById("question-counter").textContent = "0/20";
}