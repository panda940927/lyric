import json

def add_song_to_json(filename='songs.json'):
    try:
        # 讀取現有的歌曲列表
        with open(filename, 'r', encoding='utf-8') as file:
            songs = json.load(file)
            
        # 顯示目前歌曲數量
        print(f"\n目前共有 {len(songs)} 首歌")
        
        # 取得新歌曲資訊
        print("\n=== 新增歌曲 ===")
        title = input("請輸入歌曲標題: ").strip()
        lyric = input("請輸入歌詞: ").strip()
        
        # 檢查是否已存在相同標題的歌曲
        if any(song['title'] == title for song in songs):
            print(f"\n警告：歌曲「{title}」已存在！")
            return
        
        # 新增歌曲
        new_song = {
            "lyric": lyric,
            "title": title
        }
        songs.append(new_song)
        
        # 儲存回檔案
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(songs, file, ensure_ascii=False, indent=4)
            
        print(f"\n成功新增歌曲：{title}")
        print(f"目前總共有 {len(songs)} 首歌")
        
    except FileNotFoundError:
        print(f"錯誤：找不到 {filename} 檔案")
    except json.JSONDecodeError:
        print(f"錯誤：{filename} 檔案格式錯誤")
    except Exception as e:
        print(f"發生錯誤：{str(e)}")

if __name__ == "__main__":
    while True:
        add_song_to_json()
        
        # 詢問是否繼續新增
        choice = input("\n是否繼續新增歌曲？(y/n): ").strip().lower()
        if choice != 'y':
            print("程式結束")
            break