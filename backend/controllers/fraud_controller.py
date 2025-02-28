from model.fraud_model import Transaction
from backend.ml.laundering import predict_fraud


def fraud_detection(transaction: Transaction):
    transaction_dict = transaction.dict()
    fraud_prediction, fraud_reason = predict_fraud(transaction_dict)
    return {"is_fraud": bool(fraud_prediction), "reason": fraud_reason}
