from fastapi import APIRouter, HTTPException
from models.fraud_model import Transaction
from controllers.fraud_controller import predict_fraud

fraud_router = APIRouter()

@fraud_router.post("/fraud")
def get_fraud(transaction: Transaction):
    try:
        result =predict_fraud(transaction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
