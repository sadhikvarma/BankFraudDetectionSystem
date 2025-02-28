from utils.database.db import get_db, put_db
import random
from ml.laundry_controller import predict_fraud1

def predict_fraud(transaction):
    # response = predict_fraud1(transaction)

    # is_fraud = response["isFraud"]
    # fraud_reason = response["fraudReason"]
    is_fraud = random.choice([False, True])
    fraud_reason = "normal" if is_fraud == False else random.choice(["cyclic_transaction", "sudden_spike", "structuring"])
    # output = predict_fraud1(transaction)
    # print(output)
    # Save transaction to DB
    response =  put_db("INSERT INTO transactions (sender_account, receiver_account, amount,  timestamp, isfraud, fraudreason) VALUES (%s, %s, %s, %s, %s, %s)", 
                             (transaction.sender_account, transaction.receiver_account, transaction.amount, transaction.timestamp, is_fraud, fraud_reason))

    print(response)
    return {"isFraud": is_fraud, "fraudReason": fraud_reason}
