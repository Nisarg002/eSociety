from config.projectDatabase import society_collection
from models.ProjectSocietyModel import Society,SocietyOut
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi import HTTPException

async def addSociety(society: Society):
    result = await society_collection.insert_one(society.dict())
    return JSONResponse(status_code=201, content={"message": "Society added successfully"})

async def getAllSocieties():
    societies = await society_collection.find().to_list(length=None)
    return [SocietyOut(**society) for society in societies]

async def getSocietyById(societyId: str):
    society = await society_collection.find_one({"_id":ObjectId(societyId)})
    if society is None:
        raise HTTPException(status_code=404, detail="Society not found")
    return SocietyOut(**society)

async def deleteSociety(societyId: str):
    result = await society_collection.delete_one({"_id": ObjectId(societyId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Society not found")
    return JSONResponse(status_code=200, content={"message": "Society deleted successfully"})

async def updateSociety(society_id: str, updated_data: Society):
    try:
        result = await society_collection.update_one(
            {"_id": ObjectId(society_id)}, 
            {"$set": updated_data.dict(exclude_unset=True)}
        )
        if not result.matched_count:
            raise HTTPException(404, "Society not found")
    except Exception as e:
        raise HTTPException(400 if "Invalid" in str(e) else 500, str(e))

    return {"message": "Society updated"}
