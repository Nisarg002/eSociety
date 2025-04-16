from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional

class Booking(BaseModel):
    facilityName: Optional[str]
    residentName: Optional[str]
    unitNumber:Optional[str]
    requestDate: Optional[str]
    bookingDate: Optional[str]
    duration: Optional[int]
    attendees: Optional[int]
    purpose: Optional[str]
    status: Optional[str]
    user_id: Optional[str]

class BookingOut(Booking):
    id: str = Field(alias="_id")
    facilityName: Optional[str] = None
    residentName: Optional[str] = None
    unitNumber:Optional[str] = None
    requestDate: Optional[str] = None
    bookingDate: Optional[str] = None
    duration: Optional[int] = None
    attendees: Optional[int] = None
    purpose: Optional[str] = None
    status: Optional[str] = None
    user_id: Optional[str] = None

    @validator("id","user_id", pre=True, always=True)
    def convert_to_ObjectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
class BookingUpdate(BaseModel):
    bookingId:str
    status:str