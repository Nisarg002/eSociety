from fastapi import APIRouter
from models.ProjectNoticeModel import Notice,NoticeOut
from controllers.ProjectNoticeController import addNotice,getAllNotices,getNoticeById,deleteNotice, updateNotice

router = APIRouter(tags=["Project"])

@router.post("/notice/")
async def post_notice(notice: Notice):
    return await addNotice(notice)

@router.get("/notice/")
async def get_notices():
    return await getAllNotices()

@router.get("/notice/{noticeId}")
async def get_notice_by_id(noticeId: str):
    return await getNoticeById(noticeId)

@router.delete("/notice/{noticeId}")
async def delete_notice(noticeId: str):
    return await deleteNotice(noticeId)

@router.patch("/notice/{noticeId}")
async def update_notice(noticeId: str, notice: Notice):
    return await updateNotice(noticeId, notice)