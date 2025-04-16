from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional,Dict,Any
import bcrypt 

class Payment(BaseModel):
    type: Optional[str]
    amount: Optional[float]
    dueDate: Optional[str]
    status: Optional[str]
    paidDate: Optional[str]
    transactionId: Optional[str]
    month: Optional[str]
    year: Optional[str]
    description: Optional[str]
    user_id: Optional[str]

class PaymentOut(Payment):
    id: str = Field(alias="_id")
    type: Optional[str] = None
    amount: Optional[float] = None
    dueDate: Optional[str] = None
    status: Optional[str] = None
    paidDate: Optional[str] = None
    transactionId: Optional[str] = None
    month: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    user_id: Optional[str] = None
    user: Optional[Dict[str, Any]] = None

    @validator("id","user_id", pre=True, always=True)
    def convert_to_ObjectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
    @validator("user", pre=True, always=True)
    def convert_user(cls, v):
        if v and isinstance(v, dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v