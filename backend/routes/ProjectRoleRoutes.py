from fastapi import APIRouter  
from models.ProjectRoleModel import Role,RoleOut
from controllers.ProjectRoleController import getAllRoles,getRoleById,addRole,deleteRole

router = APIRouter(tags=["Project"])

@router.get("/roles/")
async def get_roles():
    return await getAllRoles()

@router.get("/role/{id}")
async def get_role_by_id(id:str):
    return await getRoleById(id)

@router.post("/role/")
async def post_role(role:Role):
    return await addRole(role)

@router.delete("/role/{id}")
async def delete_role(id:str):
    return await deleteRole(id)