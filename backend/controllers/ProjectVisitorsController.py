from config.projectDatabase import visitor_collection
from models.ProjectVisitorsModel import Visitor,VisitorOut
from bson import ObjectId
from fastapi import HTTPException
from fastapi.responses import JSONResponse

async def addVisitor(visitor: Visitor):
    result = await visitor_collection.insert_one(visitor.dict())
    return JSONResponse(status_code=201, content={"message": "Visitor added successfully"})

async def getAllVisitors():
    visitors = await visitor_collection.find().to_list(length=None)
    return [VisitorOut(**visitor) for visitor in visitors]

async def getVisitorById(visitorId: str):
    visitor = await visitor_collection.find_one({"_id": ObjectId(visitorId)})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return VisitorOut(**visitor)

async def deleteVisitor(visitorId: str):
    result = await visitor_collection.delete_one({"_id": ObjectId(visitorId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return JSONResponse(status_code=200, content={"message": "Visitor deleted successfully"})

async def updateVisitor(visitorId: str, status:str,exitTime:str):
    result = await visitor_collection.update_one(
        {"_id": ObjectId(visitorId)},
        {"$set": {"status": status, "exitTime": exitTime}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return JSONResponse(status_code=200, content={"message": "Visitor updated successfully"})