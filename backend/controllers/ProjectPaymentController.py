from config.projectDatabase import payment_collection,user_collection
from models.ProjectPaymentModel import Payment,PaymentOut
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from datetime import datetime

from datetime import datetime

async def update_expired_payments():
    """
    Updates payment status to "expired" for payments where the due date has passed
    and the status is not already "paid" or "expired".
    """
    # Get current date in the same string format
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    # Find payments where due date is in the past and status is not "paid" or "expired"
    result = await payment_collection.update_many(
        {
            "dueDate": {"$lt": current_date},
            "status": {"$nin": ["paid", "expired"]}
        },
        {"$set": {"status": "expired"}}
    )
    
    return result.modified_count

async def addPayment(payment: Payment):
    if payment.user_id == "all":
        users = await user_collection.find(
            {"role_id": ObjectId("67c7d067addc36efb1f267d5")}, {"_id": 1}
        ).to_list(length=None)
        
        if not users:
            raise HTTPException(status_code=404, detail="No users found")
        
        payments = [
            Payment(
                user_id=str(user["_id"]),  # Convert ObjectId to string for Pydantic model
                amount=payment.amount,
                status=payment.status,
                type=payment.type,
                dueDate=payment.dueDate,
                paidDate=payment.paidDate,
                transactionId=payment.transactionId,
                month=payment.month,
                year=payment.year,
                description=payment.description
            ).dict(exclude_unset=True)
            for user in users
        ]
        
        # Convert user_id back to ObjectId before inserting to MongoDB
        for payment_dict in payments:
            payment_dict["user_id"] = ObjectId(payment_dict["user_id"])
        
        await payment_collection.insert_many(payments)
        return JSONResponse(status_code=201, content={"message": f"Payment added for {len(users)} users"})
    
    else:
        # Store the payment with user_id as ObjectId
        payment_dict = payment.dict(exclude_unset=True)
        payment_dict["user_id"] = ObjectId(payment.user_id)  # Convert to ObjectId
        
        result = await payment_collection.insert_one(payment_dict)
        return JSONResponse(status_code=201, content={"message": "Payment added successfully"})

async def getAllPayments():
    # First update any expired payments
    await update_expired_payments()
    
    # Continue with your existing code
    payments = await payment_collection.find().to_list(length=None)
    
    for payment in payments:
        if "user_id" in payment and isinstance(payment["user_id"], ObjectId):
            user = await user_collection.find_one({"_id": payment["user_id"]})
            if user:
                user["_id"] = str(user["_id"])
                user["role_id"] = str(user["role_id"])
                user["society_id"] = str(user["society_id"])
                payment["user"] = user

    return [PaymentOut(**payment) for payment in payments]

async def getPaymentById(paymentId: str):
    # Update any expired payments first
    await update_expired_payments()
    
    # Continue with existing code
    payment = await payment_collection.find_one({"_id": ObjectId(paymentId)})
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return PaymentOut(**payment)

async def updatePayment(paymentId: str, payment: Payment):
    payment.user_id = ObjectId(payment.user_id)
    payment_id = ObjectId(paymentId)
    result = await payment_collection.update_one({"_id": payment_id}, {"$set": payment.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    return JSONResponse(status_code=200, content={"message": "Payment updated successfully"})

async def deletePayment(paymentId: str):
    result = await payment_collection.delete_one({"_id": ObjectId(paymentId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    return JSONResponse(status_code=200, content={"message": "Payment deleted successfully"})

async def getPaymentByUserId(userId: str):
    # Update any expired payments first
    await update_expired_payments()
    
    # Continue with existing code
    payments = await payment_collection.find({"user_id": ObjectId(userId)}).to_list(length=None)
    return [PaymentOut(**payment) for payment in payments]