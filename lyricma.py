import json
import signal
import sys

def signal_handler(signal, frame):
    """處理 Ctrl+C 信號，結束程式並儲存資料"""
    print("\n偵測到 Ctrl+C，結束輸入並儲存檔案...")
    sys.exit(0)

def add_song_to_json(filename='songs.json'):
    try:
        # 讀取現有的歌曲列表
        with open(filename, 'r', encoding='utf-8') as file:
            songs = json.load(file)
    except FileNotFoundError:
        print(f"\n找不到 {filename}，將建立新的檔案。")
        songs = []
    except json.JSONDecodeError:
        print(f"\n{filename} 檔案格式錯誤，將重新初始化檔案。")
        songs = []

    print("\n=== 開始新增歌曲 (按 Ctrl+C 結束並儲存) ===")

    try:
        while True:
            print(f"\n目前共有 {len(songs)} 首歌")
            
            # 取得新歌曲資訊
            title = input("請輸入歌曲標題: ").strip()
            lyric = input("請輸入歌詞: ").strip()

            # 檢查是否已存在相同標題的歌曲
            if any(song['title'] == title for song in songs):
                print(f"\n警告：歌曲「{title}」已存在！")
                continue

            # 新增歌曲
            new_song = {
                "lyric": lyric,
                "title": title
            }
            songs.append(new_song)

            print(f"\n成功新增歌曲：{title}")
    except KeyboardInterrupt:
        # 捕捉 Ctrl+C，進行儲存操作
        print("\n\n偵測到 Ctrl+C，結束輸入並儲存檔案...")
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(songs, file, ensure_ascii=False, indent=4)
        print(f"\n儲存完成！目前總共有 {len(songs)} 首歌")

if __name__ == "__main__":
    # 設定 Ctrl+C 信號處理
    signal.signal(signal.SIGINT, signal_handler)
    add_song_to_json()