from pydantic import BaseModel
from datetime import datetime

class Transaction(BaseModel):
    sender_account: str
    receiver_account: str
    amount: float
    timestamp: datetime
