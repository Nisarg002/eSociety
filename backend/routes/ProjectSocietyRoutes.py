from fastapi import APIRouter
from models.ProjectSocietyModel import Society
from controllers.ProjectSocietyController import addSociety,getAllSocieties,getSocietyById,deleteSociety,updateSociety
router = APIRouter(tags=["Project"])

@router.post("/society/")
async def post_society(society: Society):
    return await addSociety(society)

@router.get("/society/")
async def get_societies():
    return await getAllSocieties()

@router.get("/society/{societyId}")
async def get_society_by_id(societyId:str):
    return await getSocietyById(societyId)

@router.delete("/society/{societyId}")
async def delete_society(societyId:str):
    return await deleteSociety(societyId)

@router.patch("/society/{societyId}")
async def update_society(societyId:str,updated_data:Society):
    return await updateSociety(societyId,updated_data)