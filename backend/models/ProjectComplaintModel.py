from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional,Dict,Any

class Complaint(BaseModel):
    title:Optional[str]
    description:Optional[str]
    status:Optional[str]
    category:Optional[str]
    priority:Optional[str]
    submittedBy:Optional[str]
    date:Optional[str]
    assignedTo:Optional[str]
    user_id:Optional[str]
    contactNumber:Optional[str]

class ComplaintOut(Complaint):
    id: str = Field(alias="_id")
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    submittedBy: Optional[str] = None
    date: Optional[str] = None
    assignedTo: Optional[str] = None
    user_id: Optional[str] = None
    contactNumber: Optional[str] = None

    @validator("id", "user_id", pre=True, always=True)
    def convert_to_ObjectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
class ComplaintUpdate(BaseModel):
    complaintId:str
    status:str
    assignedTo:str