// fetch songs.json
fetch('songs.json')
  .then(response => response.json())
  .then(songs => {
    let currentSong = null;
    let score = 0;
    let remainingSongs = songs.slice(); // 克隆出所有歌曲數量
    const totalSongs = 20; // 每次只從20首歌曲中隨機選取

    document.getElementById("start-button").addEventListener("click", () => {
      score = 0;
      document.getElementById("score").textContent = score;
      document.getElementById("game-container").style.display = "block";
      document.getElementById("start-button").style.display = "none";
      nextSong();
    });

    function nextSong() {
      if (remainingSongs.length === 0) {
        alert(`遊戲結束！你的最終得分是：${score} 分`);
        resetGame();
        return;
      }
      currentSong = remainingSongs.splice(Math.floor(Math.random() * remainingSongs.length), 1)[0];
      document.getElementById("lyric").textContent = currentSong.lyric;
      document.getElementById("answer").value = "";
      document.getElementById("feedback").textContent = "";
      document.getElementById("next-button").style.display = "none";
      document.getElementById("submit-button").textContent = "提交答案"; // 初始化按鈕文字
    }

    document.getElementById("submit-button").addEventListener("click", () => {
      const userAnswer = document.getElementById("answer").value.trim();
      if (userAnswer === "") {
        alert("請輸入答案！");
        return;
      }
      if (userAnswer === currentSong.title) {
        score += 5;
        document.getElementById("feedback").textContent = "答對了！";
        document.getElementById("score").textContent = score;
      } else {
        document.getElementById("feedback").textContent = `答錯了！正確答案是：${currentSong.title}`;
      }
      document.getElementById("submit-button").textContent = "下一題"; // 改變按鈕文字
      document.getElementById("next-button").style.display = "block"; // 顯示下一題按鈕
    });

    function resetGame() {
      document.getElementById("game-container").style.display = "none";
      document.getElementById("start-button").style.display = "inline-block";
      remainingSongs = songs.slice();
    }
  });