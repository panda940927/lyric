let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let currentPlayer = null;
let isAdmin = false;

// 初始化遊戲
window.onload = function() {
    initializeLocalStorage();
};

function initializeLocalStorage() {
    if (!localStorage.getItem('leaderboard')) {
        localStorage.setItem('leaderboard', JSON.stringify([]));
    }
}

// 暱稱系統
function setNickname() {
    const nicknameInput = document.getElementById('nickname-input');
    const nickname = nicknameInput.value.trim();
    const errorElement = document.getElementById('nickname-error');
    
    if (nickname.length < 2) {
        errorElement.textContent = '暱稱至少需要2個字符';
        return;
    }
    
    currentPlayer = nickname;
    isAdmin = nickname.toLowerCase() === 'admin';
    
    document.getElementById('player-nickname').textContent = nickname;
    document.getElementById('nickname-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
    
    // 如果是管理員，顯示管理員按鈕
    if (isAdmin) {
        document.getElementById('admin-btn').style.display = 'block';
    }
}

// 相似度檢查
function similarity(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    
    if (s1 === s2) return 1.0;
    
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    
    let distance = 0;
    for (let i = 0; i < shorter.length; i++) {
        if (longer[i] !== shorter[i]) distance++;
    }
    distance += longerLength - shorter.length;
    
    return (longerLength - distance) / longerLength;
}

// 檢查答案（包含相似度判定）
function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    const correctAnswer = currentQuestions[currentQuestionIndex].title;
    const similarityScore = similarity(userAnswer, correctAnswer);
    
    if (similarityScore >= 0.8) { // 80%相似度即算正確
        score += 5;
        document.getElementById('score').textContent = score;
        showMessage(true, `答對了！獲得5分 🎉`);
    } else {
        showMessage(false, `答錯了！正確答案是：${correctAnswer} 😢`);
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1500);
}

// 排行榜系統
function updateLeaderboard(score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    leaderboard.push({
        nickname: currentPlayer,
        score: score,
        date: new Date().toISOString()
    });
    
    // 排序並只保留前10名
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    const content = document.getElementById('leaderboard-content');
    content.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <span>#${index + 1} ${entry.nickname}</span>
            <span>${entry.score}分</span>
        `;
        content.appendChild(item);
    });
    
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
}

function hideLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
}

// 管理員功能
function showAdminPanel() {
    if (!isAdmin) return;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}

function hideAdminPanel() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
}

function clearLeaderboard() {
    if (!isAdmin) return;
    if (confirm('確定要清空排行榜嗎？')) {
        localStorage.setItem('leaderboard', JSON.stringify([]));
        alert('排行榜已清空');
    }
}

function exportData() {
    if (!isAdmin) return;
    const data = {
        leaderboard: JSON.parse(localStorage.getItem('leaderboard'))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 遊戲結束時更新排行榜
function gameOver() {
    showMessage(true, `遊戲結束！你的總分是：${score} 分 🎮`);
    updateLeaderboard(score);
    
    setTimeout(() => {
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'block';
    }, 3000);
}

// 其他遊戲功能保持不變...
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