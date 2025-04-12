import json
import os

def get_matchup_stats(team1, team2):
    """
    獲取兩支球隊之間的對戰數據
    
    參數:
        team1 (str): 第一支球隊的縮寫 (例如 "LAL")
        team2 (str): 第二支球隊的縮寫 (例如 "OKC")
    
    返回:
        dict: 包含兩隊對戰數據的字典，如果找不到數據則返回None
    """
    # 數據文件路徑
    data_file = os.path.join(os.path.dirname(__file__), 'matchup_stats.json')
    
    try:
        # 讀取JSON數據
        with open(data_file, 'r') as f:
            matchup_stats = json.load(f)
        
        # 嘗試直接找到對戰記錄
        direct_key = f"{team1}vs{team2}"
        if direct_key in matchup_stats:
            return matchup_stats[direct_key]
        
        # 如果未找到，嘗試反向對戰
        reverse_key = f"{team2}vs{team1}"
        if reverse_key in matchup_stats:
            # 返回反向數據，但需要交換位置
            reverse_data = matchup_stats[reverse_key]
            result = {}
            for stat, values in reverse_data.items():
                result[stat] = (values[1], values[0])
            return result
        
        return None
    
    except Exception as e:
        print(f"讀取對戰數據時出錯: {e}")
        return None

def get_all_matchups():
    """
    獲取所有可能的對戰組合
    
    返回:
        dict: 包含所有對戰數據的字典
    """
    data_file = os.path.join(os.path.dirname(__file__), 'matchup_stats.json')
    
    try:
        with open(data_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"讀取對戰數據時出錯: {e}")
        return {}

def get_team_matchups(team):
    """
    獲取指定球隊的所有對戰數據
    
    參數:
        team (str): 球隊縮寫 (例如 "LAL")
    
    返回:
        dict: 該球隊與其他球隊的所有對戰數據
    """
    all_matchups = get_all_matchups()
    team_matchups = {}
    
    # 檢查直接對戰
    for key, data in all_matchups.items():
        if key.startswith(f"{team}vs"):
            opponent = key.replace(f"{team}vs", "")
            team_matchups[opponent] = data
    
    # 檢查反向對戰
    for key, data in all_matchups.items():
        parts = key.split("vs")
        if len(parts) == 2 and parts[1] == team:
            opponent = parts[0]
            # 轉換反向數據格式
            reversed_data = {}
            for stat, values in data.items():
                reversed_data[stat] = (values[1], values[0])
            team_matchups[opponent] = reversed_data
    
    return team_matchups

# 示例用法
if __name__ == "__main__":
    # 獲取湖人vs雷霆的對戰數據
    lal_vs_okc = get_matchup_stats("LAL", "OKC")
    if lal_vs_okc:
        print(f"LAL vs OKC 數據:\n{json.dumps(lal_vs_okc, indent=2)}")
    
    # 獲取湖人的所有對戰
    lal_matchups = get_team_matchups("LAL")
    print(f"\n湖人共有 {len(lal_matchups)} 場模擬對戰")
    
    # 打印一些統計信息
    teams = ["OKC", "MIN", "DEN", "LAC", "LAL", "GSW", "HOU", "MEM", 
             "CLE", "ATL", "IND", "MIL", "NYK", "DET", "BOS", "ORL"]
    
    print("\n每支球隊的平均得分:")
    for team in teams:
        team_matches = get_team_matchups(team)
        if team_matches:
            team_stats = []
            for opponent, match_data in team_matches.items():
                # 在新的數據結構中，需要確定當前球隊是第一個還是第二個
                if f"{team}vs{opponent}" in get_all_matchups():
                    team_pts = match_data["PTS"][0]  # 球隊是第一個
                else:
                    team_pts = match_data["PTS"][1]  # 球隊是第二個
                team_stats.append(team_pts)
            
            if team_stats:
                avg_pts = sum(team_stats) / len(team_stats)
                print(f"{team}: {avg_pts:.1f}") 