from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone
import os
import databases
import sqlalchemy
from sqlalchemy import create_engine

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
    sqlalchemy.Column("timestamp", sqlalchemy.DateTime(timezone=True)),
)

# Create tables
engine = create_engine(DATABASE_URL)
metadata.create_all(engine)

# Pydantic model for request validation
class PredictionCreate(BaseModel):
    username: str
    matchup_id: str
    selected_team: str
    timestamp: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

app = FastAPI()

# 設定 CORS - 允許所有來源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許所有來源
    allow_credentials=False,  # 當 allow_origins=["*"] 時，這必須是 False
    allow_methods=["*"],  # 允許所有方法
    allow_headers=["*"],  # 允許所有標頭
)

@app.on_event("startup")
async def startup():
    # 確保表已創建
    try:
        metadata.create_all(engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating tables: {e}")
    
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/predictions")
async def create_prediction(prediction: PredictionCreate):
    try:
        # Convert the timestamp to UTC if it has timezone info
        if prediction.timestamp.tzinfo is not None:
            prediction.timestamp = prediction.timestamp.astimezone(timezone.utc)
        else:
            # If no timezone info, assume UTC
            prediction.timestamp = prediction.timestamp.replace(tzinfo=timezone.utc)
        
        query = predictions.insert().values(
            username=prediction.username,
            matchup_id=prediction.matchup_id,
            selected_team=prediction.selected_team,
            timestamp=prediction.timestamp
        )
        
        await database.execute(query)
        return {"status": "success"}
    except Exception as e:
        print(f"Error saving prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predictions/{username}")
async def get_user_predictions(username: str):
    query = predictions.select().where(predictions.c.username == username)
    try:
        results = await database.fetch_all(query)
        return results
    except Exception as e:
        print(f"Error fetching predictions: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 