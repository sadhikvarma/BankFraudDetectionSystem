from fastapi import APIRouter
from model.fraud_model import Transaction
from controllers.fraud_controller import fraud_detection

fraud_router = APIRouter()

@fraud_router.post("/fraud")
async def detect_fraud(transaction: Transaction):
    print("In fraud")
    return fraud_detection(transaction)
