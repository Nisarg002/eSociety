from config.projectDatabase import notice_collection
from models.ProjectNoticeModel import Notice,NoticeOut
from bson import ObjectId
from fastapi import HTTPException
from fastapi.responses import JSONResponse

async def addNotice(notice: Notice):
    result = await notice_collection.insert_one(notice.dict())
    return JSONResponse(status_code=201, content={"message": "Notice added successfully"})

async def getAllNotices():
    notices = await notice_collection.find().to_list(length=None)
    return [NoticeOut(**notice) for notice in notices]

async def getNoticeById(noticeId: str):
    notice = await notice_collection.find_one({"_id": ObjectId(noticeId)})
    if notice is None:
        raise HTTPException(status_code=404, detail="Notice not found")
    return NoticeOut(**notice)

async def deleteNotice(noticeId: str):
    result = await notice_collection.delete_one({"_id": ObjectId(noticeId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notice not found")
    return JSONResponse(status_code=200, content={"message": "Notice deleted successfully"})

async def updateNotice(noticeId: str, notice: Notice):
    result = await notice_collection.update_one(
        {"_id": ObjectId(noticeId)},
        {"$set": notice.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notice not found")
    return JSONResponse(status_code=200, content={"message": "Notice updated successfully"})