from config.projectDatabase import complaint_collection
from models.ProjectComplaintModel import Complaint,ComplaintOut,ComplaintUpdate
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi import HTTPException

async def addComplaint(complaint: Complaint):
    complaint.user_id = ObjectId(complaint.user_id)
    # complaint.status = "Pending"
    result = await complaint_collection.insert_one(complaint.dict())
    return JSONResponse(status_code=201, content={"message": "Complaint added successfully"})

async def getAllComplaints():
    complaints = await complaint_collection.find().to_list(length=None)
    return [ComplaintOut(**complaint) for complaint in complaints]

async def getComplaintById(complaintId: str):
    complaint = await complaint_collection.find_one({"_id": ObjectId(complaintId)})
    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return ComplaintOut(**complaint)

async def deleteComplaint(complaintId: str):
    result = await complaint_collection.delete_one({"_id": ObjectId(complaintId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return JSONResponse(status_code=200, content={"message": "Complaint deleted successfully"})

# update status & assignedTo both in one request

async def updateComplaint(complaint:ComplaintUpdate):
    result = await complaint_collection.update_one(
        {"_id": ObjectId(complaint.complaintId)},
        {"$set": {"status": complaint.status, "assignedTo": complaint.assignedTo}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return JSONResponse(status_code=200, content={"message": "Complaint updated successfully"})

async def updateComplaintStatus(complaint_id: str, status: str):
    result = await complaint_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return JSONResponse(status_code=200, content={"message": "Complaint status updated successfully"})

async def updateComplaintAssignedTo(complaint_id: str, assigned_to: str):
    result = await complaint_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {"assignedTo": assigned_to}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return JSONResponse(status_code=200, content={"message": "Complaint assignedTo updated successfully"})

async def getComplaintByUserId(user_id: str):
    complaints = await complaint_collection.find({"user_id": ObjectId(user_id)}).to_list(length=None)
    return [ComplaintOut(**complaint) for complaint in complaints]