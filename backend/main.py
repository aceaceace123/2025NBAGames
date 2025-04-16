from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
import json
import os
import sys
import csv

# 添加數據目錄到路徑
sys.path.append(os.path.join(os.path.dirname(__file__), 'data'))
from fetch_matchup_stats import get_matchup_stats, get_team_matchups, get_all_matchups

# 創建 API 應用實例
app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aceaceace123.github.io", "http://localhost:5500", "http://127.0.0.1:5500", "*"],  # 允許的源
    allow_credentials=True,
    allow_methods=["*"],  # 允許的方法
    allow_headers=["*"],  # 允許的頭部
)

# 數據庫配置
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./predictions.db")
engine = create_engine(DATABASE_URL)
metadata = MetaData()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 預測模型
class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    matchup_id = Column(String, index=True)
    selected_team = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

# FMVP預測模型
class FMVPPrediction(Base):
    __tablename__ = "fmvp_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    team_abbr = Column(String, index=True)
    player_name = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

# 定義Pydantic模型用於請求和響應
class PredictionCreate(BaseModel):
    username: str
    matchup_id: str
    selected_team: str
    timestamp: datetime = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }

# FMVP預測請求模型
class FMVPPredictionCreate(BaseModel):
    username: str
    team_abbr: str
    player_name: str
    timestamp: datetime = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }

# 依賴項：獲取數據庫會話
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 啟動時創建表
@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)

# 關閉時關閉數據庫連接
@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()

@app.post("/predictions", response_model=PredictionCreate)
async def create_prediction(prediction: PredictionCreate, db: Session = Depends(get_db)):
    print(f"Received prediction: {prediction}")
    if prediction.timestamp is None:
        prediction.timestamp = datetime.utcnow()
    
    db_prediction = Prediction(
        username=prediction.username,
        matchup_id=prediction.matchup_id,
        selected_team=prediction.selected_team,
        timestamp=prediction.timestamp
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return prediction

@app.post("/fmvp-predictions", response_model=FMVPPredictionCreate)
async def create_fmvp_prediction(prediction: FMVPPredictionCreate, db: Session = Depends(get_db)):
    print(f"Received FMVP prediction: {prediction}")
    if prediction.timestamp is None:
        prediction.timestamp = datetime.utcnow()
    
    db_prediction = FMVPPrediction(
        username=prediction.username,
        team_abbr=prediction.team_abbr,
        player_name=prediction.player_name,
        timestamp=prediction.timestamp
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return prediction

@app.get("/predictions/{username}")
async def get_user_predictions(username: str, db: Session = Depends(get_db)):
    user_predictions = db.query(Prediction).filter(Prediction.username == username).all()
    
    if not user_predictions:
        raise HTTPException(status_code=404, detail=f"No predictions found for user {username}")
    
    # 轉換為JSON友好格式
    result = []
    for pred in user_predictions:
        result.append({
            "id": pred.id,
            "username": pred.username,
            "matchup_id": pred.matchup_id,
            "selected_team": pred.selected_team,
            "timestamp": pred.timestamp.isoformat()
        })
    
    return result

@app.get("/fmvp-predictions/{username}")
async def get_user_fmvp_predictions(username: str, db: Session = Depends(get_db)):
    user_predictions = db.query(FMVPPrediction).filter(FMVPPrediction.username == username).all()
    
    if not user_predictions:
        raise HTTPException(status_code=404, detail=f"No FMVP predictions found for user {username}")
    
    # 轉換為JSON友好格式
    result = []
    for pred in user_predictions:
        result.append({
            "id": pred.id,
            "username": pred.username,
            "team_abbr": pred.team_abbr,
            "player_name": pred.player_name,
            "timestamp": pred.timestamp.isoformat()
        })
    
    return result

# 新增路由：獲取所有冠軍預測
@app.get("/predictions/championship/all")
async def get_all_championship_predictions(db: Session = Depends(get_db)):
    # 查詢所有 matchup_id 為 "R4F" 的預測（NBA總決賽）
    championship_predictions = db.query(Prediction).filter(Prediction.matchup_id == "R4F").all()
    
    if not championship_predictions:
        raise HTTPException(status_code=404, detail="No championship predictions found")
    
    # 轉換為JSON友好格式
    result = []
    for pred in championship_predictions:
        result.append({
            "id": pred.id,
            "username": pred.username,
            "matchup_id": pred.matchup_id,
            "selected_team": pred.selected_team,
            "timestamp": pred.timestamp.isoformat()
        })
    
    return result

# 新增路由：獲取球隊隊員名單
@app.get("/team-roster/{team_abbr}")
async def get_team_roster(team_abbr: str):
    # 讀取CSV文件並過濾特定球隊的隊員
    roster_file = os.path.join(os.path.dirname(__file__), 'data', 'nba_2024_25_roster.csv')
    
    try:
        team_players = []
        with open(roster_file, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                if row['TEAM_NAME'] == team_abbr:
                    # 選擇需要的列
                    player_data = {
                        "player_id": row['PLAYER_ID'],
                        "name": row['PLAYER'],
                        "position": row['POSITION'],
                        "jersey_number": row['NUM'],
                        "height": row['HEIGHT'],
                        "weight": row['WEIGHT'],
                        "age": row['AGE'],
                        "experience": row['EXP'],
                        "school": row['SCHOOL']
                    }
                    team_players.append(player_data)
        
        if not team_players:
            # 如果沒有找到球隊，嘗試在TEAM_ID欄位中查找
            with open(roster_file, mode='r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)
                for row in csv_reader:
                    # 通過其他方式判斷球隊縮寫
                    if team_abbr in ['BOS', 'BKN', 'NYK', 'PHI', 'TOR', 'CHI', 'CLE', 'DET', 'IND', 'MIL', 
                                   'ATL', 'CHA', 'MIA', 'ORL', 'WAS', 'DEN', 'MIN', 'OKC', 'POR', 'UTA', 
                                   'GSW', 'LAC', 'LAL', 'PHX', 'SAC', 'DAL', 'HOU', 'MEM', 'NOP', 'SAS'] and row['TEAM_NAME'] == team_abbr:
                        player_data = {
                            "player_id": row['PLAYER_ID'],
                            "name": row['PLAYER'],
                            "position": row['POSITION'],
                            "jersey_number": row['NUM'],
                            "height": row['HEIGHT'],
                            "weight": row['WEIGHT'],
                            "age": row['AGE'],
                            "experience": row['EXP'],
                            "school": row['SCHOOL']
                        }
                        team_players.append(player_data)
        
        if not team_players:
            raise HTTPException(status_code=404, detail=f"No roster found for team {team_abbr}")
            
        return team_players
    
    except Exception as e:
        print(f"Error reading roster data: {e}")
        raise HTTPException(status_code=500, detail=f"Error reading roster data: {str(e)}")

# 新增路由：獲取所有模擬對戰數據
@app.get("/matchups")
async def get_matchups():
    matchups = get_all_matchups()
    if not matchups:
        raise HTTPException(status_code=404, detail="No matchup data found")
    return matchups

# 新增路由：獲取特定兩隊之間的對戰數據
@app.get("/matchups/{team1}/{team2}")
async def get_teams_matchup(team1: str, team2: str):
    matchup_data = get_matchup_stats(team1, team2)
    if not matchup_data:
        raise HTTPException(status_code=404, detail=f"No matchup data found for {team1} vs {team2}")
    return matchup_data

# 新增路由：獲取某隊的所有對戰數據
@app.get("/matchups/team/{team}")
async def get_team_all_matchups(team: str):
    team_data = get_team_matchups(team)
    if not team_data:
        raise HTTPException(status_code=404, detail=f"No matchup data found for team {team}")
    return team_data

# 測試路由
@app.get("/")
async def root():
    return {"message": "Welcome to the NBA Playoffs Predictions API!"}

