from fastapi import APIRouter
from models.ProjectComplaintModel import Complaint, ComplaintUpdate
from controllers.ProjectComplaintController import addComplaint,getAllComplaints,getComplaintById,deleteComplaint, updateComplaint, updateComplaintAssignedTo,updateComplaintStatus,getComplaintByUserId

router = APIRouter(tags=["Project"])

@router.post("/complaint/")
async def post_complaint(complaint: Complaint):
    return await addComplaint(complaint)

@router.get("/complaint/")
async def get_complaints():
    return await getAllComplaints()

@router.get("/complaint/{complaintId}")
async def get_complaint_by_id(complaintId: str):
    return await getComplaintById(complaintId)

@router.get("/complaint_user/{user_id}")
async def get_complaint_by_user_id(user_id: str):
    return await getComplaintByUserId(user_id)

@router.delete("/complaint/{complaintId}")
async def delete_complaint(complaintId: str):
    return await deleteComplaint(complaintId)

@router.patch("/complaint/")
async def update_complaint(complaint: ComplaintUpdate):
    return await updateComplaint(complaint)

@router.patch("/complaint_status/")
async def update_complaint_status(complaintId:str,status: str):
    return await updateComplaintStatus(complaintId,status)

@router.patch("/complaint_assignedTo/")
async def update_complaint_assignedTo(complaintId:str, assignedTo: str):
    return await updateComplaintAssignedTo(complaintId,assignedTo)
