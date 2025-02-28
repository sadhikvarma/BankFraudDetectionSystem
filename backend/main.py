from fastapi import FastAPI, HTTPException
print("1")
from pydantic import BaseModel
from datetime import datetime
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
print("2")
from fastapi import FastAPI
from model.fraud_model import Transaction
from ml.laundering import predict_fraud

app = FastAPI()

print("first")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from routes.fraud import fraud_router
print("Second")
app.include_router(fraud_router)



@app.get("/")
async def root():
    return {"message": "Fraud Detection API is running"}
