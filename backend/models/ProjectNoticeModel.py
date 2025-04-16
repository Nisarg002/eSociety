from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional

class Notice(BaseModel):
    title:Optional[str]
    content:Optional[str]
    category:Optional[str]
    date:Optional[str]
    postedBy:Optional[str]
    timestamp:Optional[str]

class NoticeOut(BaseModel):
    id: str = Field(alias="_id")
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    postedBy: Optional[str] = None
    timestamp: Optional[str] = None

    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v