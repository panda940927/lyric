let currentSong = null;
let score = 0;
let songs = [];
let remainingSongs = [];

// 開始遊戲按鈕
document.getElementById("start-button").addEventListener("click", async () => {
  await loadSongs();
  initializeGame();
});

// 提交答案按鈕
document.getElementById("submit-button").addEventListener("click", () => {
  const userAnswer = document.getElementById("answer").value.trim();
  if (!userAnswer) {
    alert("請輸入答案！");
    return;
  }
  checkAnswer(userAnswer);
});

// 下一首按鈕
document.getElementById("next-button").addEventListener("click", nextSong);

// 從 JSON 檔案載入題庫
async function loadSongs() {
  try {
    const response = await fetch("songs.json");
    songs = await response.json();
    remainingSongs = [...songs].sort(() => Math.random() - 0.5).slice(0, 20);
  } catch (error) {
    alert("無法載入題庫，請檢查 songs.json 是否正確！");
  }
}

// 初始化遊戲
function initializeGame() {
  score = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("game-container").classList.remove("hidden");
  document.getElementById("start-button").classList.add("hidden");
  nextSong();
}

// 顯示下一首題目
function nextSong() {
  if (remainingSongs.length === 0) {
    alert(`遊戲結束！你的最終得分是：${score} 分`);
    resetGame();
    return;
  }
  currentSong = remainingSongs.pop();
  document.getElementById("lyric").textContent = currentSong.lyric;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-button").classList.add("hidden");
}

// 檢查答案
function checkAnswer(userAnswer) {
  if (userAnswer === currentSong.title) {
    score += 5;
    document.getElementById("feedback").textContent = "答對了！";
    document.getElementById("score").textContent = score;
  } else {
    document.getElementById("feedback").textContent = `答錯了！正確答案是：${currentSong.title}`;
  }
  document.getElementById("next-button").classList.remove("hidden");
}

// 重置遊戲
function resetGame() {
  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("start-button").classList.remove("hidden");
}