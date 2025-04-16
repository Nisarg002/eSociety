from config.projectDatabase import user_collection,role_collection,society_collection
from models.ProjectUserModel import User,UserOut,UserLogin,UserUpdate,ResetPasswordRequest
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi import HTTPException
import bcrypt
from utils.SendMail import send_mail
import datetime
import jwt
import bcrypt

async def getAllUser():
    users = await user_collection.find().to_list(length=None)

    for user in users:
        if "role_id" in user and isinstance(user["role_id"],ObjectId):
            user["role_id"] = str(user["role_id"])
            role = await role_collection.find_one({"_id": ObjectId(user["role_id"])})
        
        if role:
            role["_id"] = str(role["_id"])
            user["role"] = role
        if "society_id" in user and isinstance(user["society_id"],ObjectId):
            user["society_id"] = str(user["society_id"])
            society = await society_collection.find_one({"_id": ObjectId(user["society_id"])})

        if society:
            society["_id"] = str(society["_id"])
            user["society"] = society

    return [UserOut(**user) for user in users]

async def getUserByRole(role:str):
    users = await user_collection.find({"role_id": ObjectId(role)}).to_list(length=None)

    for user in users:
        if "role_id" in user and isinstance(user["role_id"],ObjectId):
            user["role_id"] = str(user["role_id"])
            role = await role_collection.find_one({"_id": ObjectId(user["role_id"])})
        
        if role:
            role["_id"] = str(role["_id"])
            user["role"] = role
        if "society_id" in user and isinstance(user["society_id"],ObjectId):
            user["society_id"] = str(user["society_id"])
            society = await society_collection.find_one({"_id": ObjectId(user["society_id"])})

        if society:
            society["_id"] = str(society["_id"])
            user["society"] = society

    return [UserOut(**user) for user in users]

async def addUser(user:User):
    user.role_id = ObjectId(user.role_id)
    user.society_id = ObjectId(user.society_id)
    result = await user_collection.insert_one(user.dict())
    # send_mail(user["email"],"User Created","User created successfully")
    return JSONResponse(status_code=201, content={"message": "User added successfully"})

async def signUpUser(user:User):
    user.role_id = ObjectId(user.role_id)
    result = await user_collection.insert_one(user.dict())
    return JSONResponse(status_code=201, content={"message": "User signed up successfully"})

async def deleteUser(userId:str):
    result = await user_collection.delete_one({"_id":ObjectId(userId)})
    return {"message": "User is deleted successfully"}

async def getUserById(userId:str):
    result = await user_collection.find_one({"_id":ObjectId(userId)})
    if "role_id" in result and isinstance(result["role_id"],ObjectId):
        role = await role_collection.find_one({"_id": ObjectId(result["role_id"])})
        
        if role:
            result["role"] = role
    if "society_id" in result and isinstance(result["society_id"],ObjectId):
        society = await society_collection.find_one({"_id": ObjectId(result["society_id"])})

        if society:
            result["society"] = society
    return UserOut(**result)


async def loginUser(request: UserLogin):
    foundUser = await user_collection.find_one({"email": request.email})
    
    if not foundUser:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert ObjectId fields to strings
    foundUser["_id"] = str(foundUser["_id"])
    foundUser["role_id"] = str(foundUser["role_id"])
    
    if foundUser.get("society_id"):
        foundUser["society_id"] = str(foundUser["society_id"])

    # Check password
    if "password" in foundUser and bcrypt.checkpw(request.password.encode(), foundUser["password"].encode()):
        role = await role_collection.find_one({"_id": ObjectId(foundUser["role_id"])})
        society = await society_collection.find_one({"_id": ObjectId(foundUser["society_id"])}) if foundUser.get("society_id") else None
        
        foundUser["role"] = role
        foundUser["society"] = society
        return {"message": "Login successful", "user": UserOut(**foundUser)}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

async def updateUserRole(user:UserUpdate):
    user.user_id = ObjectId(user.user_id)
    user.role_id = ObjectId(user.role_id)

    result = await user_collection.update_one(
        {"_id": user.user_id},
        {"$set": {"role_id":user.role_id }}
    )
    
    if result.modified_count != 0:
        user = await user_collection.find_one({"_id": user.user_id})
        send_mail(user["email"],"Role Updated","Your request for registration has been approved")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return JSONResponse(status_code=200, content={"message": "User role updated successfully"})


async def updateUser(userId: str, user: User):
    user_id = ObjectId(userId)
    user.role_id = ObjectId(user.role_id)
    user.society_id = ObjectId(user.society_id)

    update_data = user.dict(exclude={"password"})  # Exclude password

    result = await user_collection.update_one(
        {"_id": user_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return JSONResponse(status_code=200, content={"message": "User updated successfully"})

SECRET_KEY = "mysecretkey"
def generate_token(email:str):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {"sub": email, "exp": expiration}
    token = jwt.encode(payload,SECRET_KEY,algorithm="HS256")
    return token

async def forgotPassword(email:str):
    foundUser = await user_collection.find_one({"email":email})
    if not foundUser:
        raise HTTPException(status_code=404, detail="User not found")
    token = generate_token(email)
    resetLink = f"http://localhost:5173/resetpassword/{token}"
    body = f"""
        <html>
            <h1>Click the link below to reset your password:</h1>
            <a href="{resetLink}">Reset Password</a>
        </html>
    """
    subject = "Reset Password"
    send_mail(email,subject,body)
    return {"message":"Mail sent successfully"}
    

async def resetPassword(data:ResetPasswordRequest):
    try:
        payload = jwt.decode(data.token,SECRET_KEY,algorithms="HS256")
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401,detail="Invalid token")
        
        hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        await user_collection.update_one({"email":email},{"$set":{"password":hashed_password}})

        return {"message": "Password reset successfully"}
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))