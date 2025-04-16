from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional,Dict,Any
import bcrypt 

class User(BaseModel):
    username:Optional[str] = None
    email:Optional[str] = None
    password:Optional[str] = None
    name:Optional[str] = None 
    flatNo:Optional[str] = None
    phone:Optional[str] = None
    role_id:Optional[str] = None
    status:Optional[bool] = True
    society_id:Optional[str] = None

    @validator("password",pre=True,always=True)
    def encrypt_password(cls,v):
        if v is None:
            return None
        return bcrypt.hashpw(v.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    
class UserOut(User):
    id:str = Field(alias="_id")
    role_id:Optional[str] = None
    role:Optional[Dict[str,Any]] = None
    username:Optional[str] = None
    email:Optional[str] = None
    password:Optional[str] = None
    name:Optional[str] = None
    flatNo:Optional[str] = None
    phone:Optional[str] = None
    status:Optional[bool] = True
    society_id:Optional[str] = None
    society:Optional[Dict[str,Any]] = None

    @validator("id","role_id","society_id",pre=True,always=True)
    def convert_to_objectId(cls,v):
        if v is None:
            return None
        if isinstance(v, ObjectId):
            return str(v)
        return v

    
    @validator("role","society",pre=True,always=True)
    def convert_role(cls,v):
        if v and isinstance(v, dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v

    
    # @validator("password",pre=True,always=True)
    # def encrypt_password(cls,v):
    #     if v is None:
    #         return None
    #     return bcrypt.hashpw(v.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
class UserSignup(BaseModel):
    name:str
    email:str
    password:str
    role_id:str

class UserLogin(BaseModel):
    email:str
    password:str

class UserUpdate(BaseModel):
    user_id:str
    role_id:str

class ResetPasswordRequest(BaseModel):
    token: str
    password: str