from fastapi import APIRouter
from models.ProjectVisitorsModel import Visitor,VisitorOut
from controllers.ProjectVisitorsController import addVisitor,getAllVisitors,getVisitorById,deleteVisitor,updateVisitor

router = APIRouter(tags=["Project"])

@router.post("/visitor/")
async def post_visitor(visitor: Visitor):
    return await addVisitor(visitor)

@router.get("/visitor/")
async def get_visitors():
    return await getAllVisitors()

@router.get("/visitor/{visitorId}")
async def get_visitor_by_id(visitorId: str):
    return await getVisitorById(visitorId)

@router.delete("/visitor/{visitorId}")
async def delete_visitor(visitorId: str):
    return await deleteVisitor(visitorId)

@router.patch("/visitor_status/")
async def update_visitor(visitorId: str,status:str,exitTime:str):
    return await updateVisitor(visitorId,status,exitTime)