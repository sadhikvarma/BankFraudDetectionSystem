import pandas as pd
import networkx as nx
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from utils.database.db import get_db, put_db

# Fetch past transactions from PostgreSQL using get_db
def fetch_past_transactions(timestamp, days=3):
    past_time = timestamp - timedelta(days=days)
    query = """
        SELECT sender_account, receiver_account, amount, timestamp 
        FROM transactions 
        WHERE timestamp >= $1 AND timestamp < $2
    """
    result = get_db(query, (past_time, timestamp))
    return pd.DataFrame(result)

# Detect Cyclic Transactions
def detect_cycles(transactions, tolerance=0.1):
    G = nx.DiGraph()
    for _, row in transactions.iterrows():
        G.add_edge(row['sender_account'], row['receiver_account'], amount=row['amount'])

    cycles = list(nx.simple_cycles(G))
    flagged_cycles = []

    for cycle in cycles:
        amounts = [transactions[(transactions['sender_account'] == cycle[i]) & (transactions['receiver_account'] == cycle[(i+1) % len(cycle)])]['amount'].values for i in range(len(cycle))]
        amounts = [a[0] if len(a) > 0 else 0 for a in amounts]
        min_amt, max_amt = min(amounts), max(amounts)
        if min_amt > 0 and (max_amt / min_amt - 1) <= tolerance:
            flagged_cycles.append(cycle)

    return flagged_cycles

# Compute Fraud Features
def compute_fraud_features(df):
    df = df.copy()
    df["has_cycle"] = False
    df["spike"] = False
    df["structuring"] = False
    df["fraud_reason"] = "normal"
    df["is_fraud"] = 0

    for idx, row in df.iterrows():
        past_data = df[(df['timestamp'] < row['timestamp']) & (df['timestamp'] >= row['timestamp'] - timedelta(days=3))]
        cycles = detect_cycles(past_data)
        df.at[idx, "has_cycle"] = any(row["sender_account"] in cycle or row["receiver_account"] in cycle for cycle in cycles)

        if not past_data.empty:
            avg_amount = past_data["amount"].mean()
            df.at[idx, "spike"] = row["amount"] > 2 * avg_amount

        structuring_detected = len(past_data) >= 3 and past_data["amount"].max() < 10000
        df.at[idx, "structuring"] = structuring_detected

        fraud_reasons = []
        if df.at[idx, "has_cycle"]:
            fraud_reasons.append("cyclic_transaction")
        if df.at[idx, "spike"]:
            fraud_reasons.append("sudden_spike")
        if df.at[idx, "structuring"]:
            fraud_reasons.append("structuring")

        if fraud_reasons:
            df.at[idx, "is_fraud"] = 1
            df.at[idx, "fraud_reason"] = ", ".join(fraud_reasons)

    return df

# Load Historical Data
historical_data = pd.read_csv('historical_transactions.csv')
historical_data["timestamp"] = pd.to_datetime(historical_data["timestamp"])
historical_data = compute_fraud_features(historical_data)

# Train Model
y = historical_data["is_fraud"]
X = historical_data.drop(columns=['timestamp', 'sender_account', 'receiver_account', 'is_fraud', 'fraud_reason'])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Predict Fraud
def predict_fraud1(new_transaction):
    past_transactions = fetch_past_transactions(new_transaction['timestamp'])
    new_df = compute_fraud_features(pd.DataFrame([new_transaction]))
    new_X = new_df.drop(columns=['timestamp', 'sender_account', 'receiver_account', 'is_fraud', 'fraud_reason'])
    fraud_prediction = model.predict(new_X)[0]
    fraud_reason = new_df["fraud_reason"].iloc[0]
    return fraud_prediction, fraud_reason

# Example Usage
new_transaction = {"sender_account": "B", "receiver_account": "D", "amount": 9700, "timestamp": datetime(2025, 2, 24, 10, 0)}
fraud_prediction, fraud_reason =  predict_fraud1(new_transaction)
print("Predicted Fraudulent:", fraud_prediction)
print("Fraud Reason:", fraud_reason)