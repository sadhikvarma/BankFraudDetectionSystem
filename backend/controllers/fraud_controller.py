from utils.database.db import get_db,put_db
import random

async def predict_fraud(transaction):
    # Dummy logic to predict fraud
    is_fraud = random.choice([True, False])
    fraud_reason = "Unusual Amount" if is_fraud else None

    # Save transaction to DB
    await put_db("INSERT INTO transactions (sender, receiver, amount, description, timestamp, is_fraud, fraud_reason) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                 (transaction.sender, transaction.receiver, transaction.amount, transaction.description, transaction.timestamp, is_fraud, fraud_reason))

    return {"isFraud": is_fraud, "fraudReason": fraud_reason}
