from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional

class Staff(BaseModel):
    name:Optional[str]
    type:Optional[str]
    contact:Optional[str]
    apartment:Optional[str]
    entryTime:Optional[str]
    exitTime:Optional[str]
    status:Optional[str]

class StaffOut(BaseModel):
    id: str = Field(alias="_id")
    name: Optional[str] = None
    type: Optional[str] = None
    contact: Optional[str] = None
    apartment: Optional[str] = None
    entryTime: Optional[str] = None
    exitTime: Optional[str] = None
    status: Optional[str] = None

    @validator("id", pre=True, always=True)
    def convert_to_ObjectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
class StaffUpdate(BaseModel):
    staffId:Optional[str]
    exitTime:Optional[str]
    status:Optional[str]