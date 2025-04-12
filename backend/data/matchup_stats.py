import random
import json
import itertools

# 球隊列表
teams = [
    "OKC", "MIN", "DEN", "LAC", "LAL", "GSW", "HOU", "MEM", 
    "CLE", "ATL", "IND", "MIL", "NYK", "DET", "BOS", "ORL"
]

# 數據範圍
stat_ranges = {
    "PTS": (90, 125),
    "REB": (30, 50),
    "AST": (18, 35),
    "STL": (3, 15),
    "BLK": (2, 10),
    "TO": (8, 20),
    "FG%": (42.0, 56.0),
    "3P%": (30.0, 45.0),
    "FT%": (65.0, 90.0)
}

def generate_stat(stat_name):
    """生成純隨機的統計數據"""
    min_val, max_val = stat_ranges[stat_name]
    
    # 生成兩隊的隨機數據
    team1_val = random.uniform(min_val, max_val)
    team2_val = random.uniform(min_val, max_val)
    
    # 百分比數據保留一位小數
    if "%" in stat_name:
        team1_val = round(team1_val, 1)
        team2_val = round(team2_val, 1)
    else:
        team1_val = int(team1_val)
        team2_val = int(team2_val)
    
    return (team1_val, team2_val)

# 創建所有可能的對戰組合
matchup_stats = {}

# 生成所有可能的對戰組合
for team1, team2 in itertools.combinations(teams, 2):
    # 生成對戰數據
    matchup_data = {}
    for stat_name in stat_ranges.keys():
        matchup_data[stat_name] = generate_stat(stat_name)
    
    # 只存儲一個方向的對戰數據
    matchup_key = f"{team1}vs{team2}"
    matchup_stats[matchup_key] = matchup_data

# 輸出為JSON文件
with open('backend/data/matchup_stats.json', 'w') as f:
    json.dump(matchup_stats, f, indent=2)

print(f"生成了 {len(matchup_stats)} 組對戰數據並保存到 matchup_stats.json")

# 輸出示例數據
print("\n示例數據:")
example = list(matchup_stats.items())[0]
print(f"{example[0]}: {json.dumps(example[1], indent=2)}") 