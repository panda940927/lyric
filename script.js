let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

function showMessage(isCorrect, message) {
    const messageBox = document.getElementById('message-box');
    const answerInput = document.getElementById('answer');
    
    // 設置訊息內容和樣式
    messageBox.textContent = message;
    messageBox.className = 'message-box show ' + (isCorrect ? 'correct' : 'incorrect');
    answerInput.className = 'answer-input ' + (isCorrect ? 'correct' : 'incorrect');
    
    // 3秒後隱藏訊息
    setTimeout(() => {
        messageBox.className = 'message-box';
        answerInput.className = 'answer-input';
    }, 3000);
}

async function startGame() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = '0';
    
    await loadSongs();
}

async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        const songs = await response.json();
        
        // Fisher-Yates洗牌算法
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        
        currentQuestions = songs.slice(0, 20);
        displayQuestion();
    } catch (error) {
        console.error('Error loading songs:', error);
        showMessage(false, '載入題目失敗，請重新整理頁面！');
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        gameOver();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('lyric').textContent = question.lyric;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    const correctAnswer = currentQuestions[currentQuestionIndex].title;
    
    if (userAnswer === correctAnswer) {
        score += 5;
        document.getElementById('score').textContent = score;
        showMessage(true, `答對了！獲得5分 🎉`);
    } else {
        showMessage(false, `答錯了！正確答案是：${correctAnswer} 😢`);
    }
    
    // 延遲一下再顯示下一題，讓玩家有時間看到訊息
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1500);
}

function gameOver() {
    // 先顯示最終分數訊息
    showMessage(true, `遊戲結束！你的總分是：${score} 分 🎮`);
    
    // 延遲一下再回到歡迎畫面
    setTimeout(() => {
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'block';
    }, 3000);
}

// 綁定回車鍵提交答案
document.getElementById('answer').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});