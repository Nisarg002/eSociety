from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional,Dict,Any

class PaymentStatus(BaseModel):
    payment_id:Optional[str]
    user_id:Optional[str]
    status:Optional[str]

    @validator('payment_id',"user_id",pre=True,always=True)
    def convert_to_object_id(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
class PaymentStatusOuts(PaymentStatus):
    id: str = Field(alias="_id")
    payment_id: Optional[str] = None
    user_id: Optional[str] = None
    status: Optional[str] = None

    @validator("id","user_id", pre=True, always=True)
    def convert_to_ObjectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

class PaymentStatusGet(BaseModel):
    payment_id:Optional[str]
    user_id:Optional[str]