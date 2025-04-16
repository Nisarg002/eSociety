from fastapi import APIRouter
from models.ProjectPaymentStatusModel import PaymentStatus,PaymentStatusOuts,PaymentStatusGet
from controllers.ProjectPaymentStatusController import addPaymentStatus,getAllPaymentStatuses,getPaymentStatusById,deletePaymentStatus,updatePaymentStatus,getPaymentStatusByPaymentId,getPaymentStatusByUserId,updateStatusPaymentStatusByUserIdPaymentId

router = APIRouter(tags=["Project"])

@router.post("/paymentStatus/")
async def post_payment_status(paymentStatus: PaymentStatus):
    return await addPaymentStatus(paymentStatus)

@router.get("/paymentStatus/")
async def get_payment_statuses():
    return await getAllPaymentStatuses()

@router.get("/paymentStatus/{paymentStatusId}")
async def get_payment_status_by_id(paymentStatusId: str):
    return await getPaymentStatusById(paymentStatusId)

@router.delete("/paymentStatus/{paymentStatusId}")
async def delete_payment_status(paymentStatusId: str):
    return await deletePaymentStatus(paymentStatusId)

@router.patch("/paymentStatus/")
async def update_payment_status(paymentStatusId: str,paymentStatus: PaymentStatus):
    return await updatePaymentStatus(paymentStatusId,paymentStatus)

@router.get("/paymentStatus_payment/{paymentId}")
async def get_payment_status_by_payment_id(paymentId: str):
    return await getPaymentStatusByPaymentId(paymentId)

@router.get("/paymentStatus_user/{userId}")
async def get_payment_status_by_user_id(userId: str):
    return await getPaymentStatusByUserId(userId)

@router.patch("/paymentStatus_user_payment/")
async def update_status_payment_status_by_user_id_payment_id(paymentStatus:PaymentStatus):
    return await updateStatusPaymentStatusByUserIdPaymentId(paymentStatus)