from fastapi import APIRouter
from models.ProjectUserModel import User,UserOut, UserSignup, UserLogin, UserUpdate,ResetPasswordRequest
from controllers.ProjectUserController import getAllUser, getUserById, addUser,deleteUser, signUpUser,loginUser,updateUserRole,updateUser,forgotPassword,resetPassword,getUserByRole

router = APIRouter(tags=["Project"])

@router.get("/user/")
async def get_project_users():
    return await getAllUser()

@router.post("/user/")
async def post_project_user(user:User):
    return await addUser(user)

@router.get("/user_role/{role}")
async def get_project_user_by_role(role:str):
    return await getUserByRole(role)

@router.get("/user_id/{userId}")
async def get_project_user_by_id(userId:str):
    return await getUserById(userId)

@router.delete("/user/{userId}")
async def delete_project_user(userId:str):
    return await deleteUser(userId)

@router.post("/user/signup/")
async def sign_up_user(user:User):
    return await signUpUser(user)

@router.post("/user/login/")
async def login_user(user:UserLogin):
    return await loginUser(user)

@router.patch("/user/role/")
async def update_user_role(user:UserUpdate):
    return await updateUserRole(user)
    # return {"message":"Update Role"}

@router.patch("/update_user/{userId}")
async def update_user(userId:str,user:User):
    return await updateUser(userId, user)

@router.post("/forgot-password")
async def forgot_password(email:str):
    return await forgotPassword(email)

@router.post("/reset-password")
async def reset_password(data:ResetPasswordRequest):
    return await resetPassword(data)