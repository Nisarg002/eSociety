from fastapi import APIRouter
from models.ProjectPaymentModel import Payment,PaymentOut
from controllers.ProjectPaymentController import addPayment,getAllPayments,getPaymentById,deletePayment,updatePayment,getPaymentByUserId

router = APIRouter(tags=["Project"])

@router.post("/payment/")
async def post_payment(payment: Payment):
    return await addPayment(payment)

@router.get("/payment/")
async def get_payments():
    return await getAllPayments()

@router.get("/payment/{paymentId}")
async def get_payment_by_id(paymentId: str):
    return await getPaymentById(paymentId)

@router.patch("/update_payment/{paymentId}")
async def update_payment(paymentId: str, payment: Payment):
    return await updatePayment(paymentId, payment)

@router.delete("/payment/{paymentId}")
async def delete_payment(paymentId: str):
    return await deletePayment(paymentId)

@router.get("/payment_user/{userId}")
async def get_payment_by_user_id(userId: str):
    return await getPaymentByUserId(userId)