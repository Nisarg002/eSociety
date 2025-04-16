from config.projectDatabase import role_collection  
from models.ProjectRoleModel import Role, RoleOut  
from bson import ObjectId  

async def getAllRoles():
    roles = await role_collection.find().to_list()  
    return [RoleOut(**role) for role in roles]  

async def addRole(role:Role):
    result = await role_collection.insert_one(role.dict())
    return {"message" : "Data added successfully"} 

async def deleteRole(roleId:str):
    result = await role_collection.delete_one({"_id":ObjectId(roleId)})
    return {"message": "Data is Deleted"}

async def getRoleById(roleId:str):
    result = await role_collection.find_one({"_id":ObjectId(roleId)})
    return RoleOut(**result)