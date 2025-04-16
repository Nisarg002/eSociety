from fastapi import APIRouter
from models.ProjectStaffModel import Staff,StaffUpdate
from controllers.ProjectStaffController import addStaff,getAllStaff,getStaffById,deleteStaff,updateStaff

router = APIRouter(tags=["Project"])

@router.post("/staff/")
async def post_staff(staff: Staff):
    return await addStaff(staff)

@router.get("/staff/")
async def get_staff():
    return await getAllStaff()

@router.get("/staff/{staffId}")
async def get_staff_by_id(staffId: str):
    return await getStaffById(staffId)

@router.delete("/staff/{staffId}")
async def delete_staff(staffId: str):
    return await deleteStaff(staffId)

@router.patch("/staff/")
async def update_staff(staff: StaffUpdate):
    return await updateStaff(staff)