from pydantic import BaseModel
from datetime import datetime

class Transaction(BaseModel):
    sender_account: int
    receiver_account: int
    amount: int
    timestamp: datetime
