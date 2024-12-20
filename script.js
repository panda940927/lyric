let currentSong = null;
let score = 0;
let songs = [];
let remainingSongs = [];
let questionCount = 0;
const MAX_QUESTIONS = 20;

// 確保 DOM 完全加載後再執行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化按鈕事件監聽
    document.getElementById("start-button").addEventListener("click", async () => {
        console.log("Start button clicked"); // 調試用
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
});

// 從 JSON 檔案載入題庫
async function loadSongs() {
    try {
        console.log("Loading songs..."); // 調試用
        // 假資料或使用 fetch 來載入真實的 JSON 檔案
        songs = [
            { "lyric": "測試歌詞1", "title": "測試歌曲1" },
            { "lyric": "測試歌詞2", "title": "測試歌曲2" },
            { "lyric": "測試歌詞3", "title": "測試歌曲3" },
            // 添加更多測試數據或使用實際的 fetch 請求
        ];
        
        remainingSongs = [...songs].sort(() => Math.random() - 0.5);
        console.log("Songs loaded:", remainingSongs); // 調試用
        return true;
    } catch (error) {
        console.error("Error loading songs:", error); // 調試用
        alert("無法載入題庫！");
        return false;
    }
}

// 初始化遊戲
function initializeGame() {
    console.log("Initializing game..."); // 調試用
    score = 0;
    questionCount = 0;
    document.getElementById("score").textContent = score;
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("start-button").classList.add("hidden");
    nextSong();
}

// 顯示下一首題目
function nextSong() {
    console.log("Loading next song..."); // 調試用
    if (remainingSongs.length === 0 || questionCount >= MAX_QUESTIONS) {
        alert(`遊戲結束！你的最終得分是：${score} 分`);
        resetGame();
        return;
    }

    questionCount++;
    currentSong = remainingSongs.pop();
    console.log("Current song:", currentSong); // 調試用

    document.getElementById("lyric").textContent = currentSong.lyric;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("submit-button").classList.remove("hidden");
    document.getElementById("next-button").classList.add("hidden");
}

// 檢查答案
function checkAnswer(userAnswer) {
    console.log("Checking answer:", userAnswer); // 調試用
    document.getElementById("submit-button").classList.add("hidden");

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
    console.log("Resetting game..."); // 調試用
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("start-button").classList.remove("hidden");
}