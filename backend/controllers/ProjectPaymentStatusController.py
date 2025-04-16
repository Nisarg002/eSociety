from config.projectDatabase import payment_status_collection
from models.ProjectPaymentStatusModel import PaymentStatus,PaymentStatusOuts,PaymentStatusGet
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi import HTTPException

async def addPaymentStatus(payment_status: PaymentStatus):
    payment_status.user_id = ObjectId(payment_status.user_id)
    payment_status.payment_id = ObjectId(payment_status.payment_id)
    result = await payment_status_collection.insert_one(payment_status.dict())
    return JSONResponse(status_code=201, content={"message": "Payment status added successfully"})

async def getAllPaymentStatuses():
    payment_statuses = await payment_status_collection.find().to_list(length=None)
    return [PaymentStatusOuts(**payment_status) for payment_status in payment_statuses]

async def getPaymentStatusById(payment_status_id: str):
    payment_status = await payment_status_collection.find_one({"_id": ObjectId(payment_status_id)})
    if payment_status is None:
        raise HTTPException(status_code=404, detail="Payment status not found")
    return PaymentStatusOuts(**payment_status)

# change payment status api

async def updatePaymentStatus(payment_status_id: str,payment_status: PaymentStatus):
    payment_status.user_id = ObjectId(payment_status.user_id)
    payment_status.payment_id = ObjectId(payment_status.payment_id)
    result = await payment_status_collection.update_one(
        {"_id": ObjectId(payment_status_id)},
        {"$set": payment_status.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payment status not found")
    return JSONResponse(status_code=200, content={"message": "Payment status updated successfully"})

async def deletePaymentStatus(payment_status_id: str):
    result = await payment_status_collection.delete_one({"_id": ObjectId(payment_status_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Payment status not found")
    return JSONResponse(status_code=200, content={"message": "Payment status deleted successfully"})

async def getPaymentStatusByUserId(user_id: str):
    payment_statuses = await payment_status_collection.find({"user_id": ObjectId(user_id)}).to_list(length=None)
    return [PaymentStatusOuts(**payment_status) for payment_status in payment_statuses]

async def getPaymentStatusByPaymentId(payment_id: str):
    payment_statuses = await payment_status_collection.find({"payment_id": ObjectId(payment_id)}).to_list(length=None)
    return [PaymentStatusOuts(**payment_status) for payment_status in payment_statuses]

async def updateStatusPaymentStatusByUserIdPaymentId(paymentStatus: PaymentStatus):
    result = await payment_status_collection.update_one(
        {"user_id": ObjectId(paymentStatus.user_id), "payment_id": ObjectId(paymentStatus.payment_id)},
        {"$set": {"status": "payment_status.status"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payment status not found")
    return JSONResponse(status_code=200, content={"message": "Payment status updated successfully"})