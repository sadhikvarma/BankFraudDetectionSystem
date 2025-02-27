from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from db import get_db,put_db
from laundering import predict_fraud, compute_fraud_features
import pandas as pd

app = FastAPI()

class Transaction(BaseModel):
    sender_account: str
    receiver_account: str
    amount: float
    timestamp: datetime

@app.post("/get_fraud")
async def get_fraud(transaction: Transaction):
    try:
        transaction_dict = transaction.model_dump()
        fraud_prediction, fraud_reason = predict_fraud(transaction_dict)
        return {"fraud_prediction": fraud_prediction, "fraud_reason": fraud_reason}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get_fraud_reason")
async def get_fraud_reason(transaction: Transaction):
    try:
        transaction_dict = transaction.dict()
        result = compute_fraud_features(pd.DataFrame([transaction_dict]))
        fraud_reason = result["fraud_reason"].iloc[0]
        return {"fraud_reason": fraud_reason}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Fraud Detection API is running"}



