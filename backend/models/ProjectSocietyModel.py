from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional

class Society(BaseModel):
    name: Optional[str]
    location: Optional[str]
    totalUnits: Optional[int]
    managedSince: Optional[str]
    contactPerson: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    status: Optional[bool]

class SocietyOut(Society):
    id: str = Field(alias="_id")
    name: Optional[str] = None
    location: Optional[str] = None
    totalUnits: Optional[int] = None
    managedSince: Optional[str] = None
    contactPerson: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    status: Optional[bool] = None

    @validator("id", pre=True, always=True)
    def convert_to_ObjectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v