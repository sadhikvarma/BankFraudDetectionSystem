from pydantic import BaseModel

class Transaction(BaseModel):
    sender: str
    receiver: str
    amount: float
    description: str
    timestamp: str
