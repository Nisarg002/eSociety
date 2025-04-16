from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional

class Visitor(BaseModel):
    visitorName:Optional[str]
    contactNumber:Optional[str]
    purpose:Optional[str]
    expectedDuration:Optional[int]
    hostName:Optional[str]
    hostFlat:Optional[str]
    idType:Optional[str]
    idNumber:Optional[str]
    vehicleNumber:Optional[str]
    status:Optional[str]
    entryTime:Optional[str]
    exitTime:Optional[str]

class VisitorOut(Visitor):
    id: str = Field(alias="_id")
    visitorName: Optional[str]= None
    contactNumber: Optional[str]= None
    purpose: Optional[str]= None
    expectedDuration: Optional[int]= None
    hostName: Optional[str]= None
    hostFlat: Optional[str]= None
    idType: Optional[str]= None
    idNumber: Optional[str]= None
    vehicleNumber: Optional[str]= None
    status: Optional[str]= None
    entryTime: Optional[str]= None
    exitTime: Optional[str]= None

    @validator("id", pre=True, always=True)
    def convert_to_ObjectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v