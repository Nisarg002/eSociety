from config.projectDatabase import staff_collection
from models.ProjectStaffModel import Staff,StaffOut,StaffUpdate
from bson import ObjectId
from fastapi import HTTPException
from fastapi.responses import JSONResponse

async def addStaff(staff: Staff):
    staff.exitTime = "Not Exited"
    staff.status = "active"
    result = await staff_collection.insert_one(staff.dict())
    return JSONResponse(status_code=201, content={"message": "Staff added successfully"})

async def getAllStaff():
    staffs = await staff_collection.find().to_list(length=None)
    return [StaffOut(**staff) for staff in staffs]

async def getStaffById(staffId: str):
    staff = await staff_collection.find_one({"_id": ObjectId(staffId)})
    if staff is None:
        raise HTTPException(status_code=404, detail="Staff not found")
    return StaffOut(**staff)

async def deleteStaff(staffId: str):
    result = await staff_collection.delete_one({"_id": ObjectId(staffId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff not found")
    return JSONResponse(status_code=200, content={"message": "Staff deleted successfully"})

async def updateStaff(staff:StaffUpdate):
    result = await staff_collection.update_one(
        {"_id": ObjectId(staff.staffId)},
        {"$set": {"status": staff.status, "exitTime": staff.exitTime}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Staff not found")
    return JSONResponse(status_code=200, content={"message": "Staff status updated successfully"})