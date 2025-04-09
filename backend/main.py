from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
import databases
import sqlalchemy

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")

# SQLAlchemy specific engine
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# Define your tables
predictions = sqlalchemy.Table(
    "predictions",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("username", sqlalchemy.String),
    sqlalchemy.Column("matchup_id", sqlalchemy.String),
    sqlalchemy.Column("selected_team", sqlalchemy.String),
    sqlalchemy.Column("timestamp", sqlalchemy.DateTime),
)

# Pydantic model for request validation
class PredictionCreate(BaseModel):
    username: str
    matchup_id: str
    selected_team: str
    timestamp: datetime

app = FastAPI()

# 設定 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aceaceace123.github.io"],  # 你的 GitHub Pages 網站
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/predictions")
async def create_prediction(prediction: PredictionCreate):
    query = predictions.insert().values(
        username=prediction.username,
        matchup_id=prediction.matchup_id,
        selected_team=prediction.selected_team,
        timestamp=prediction.timestamp
    )
    
    try:
        await database.execute(query)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predictions/{username}")
async def get_user_predictions(username: str):
    query = predictions.select().where(predictions.c.username == username)
    try:
        results = await database.fetch_all(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 