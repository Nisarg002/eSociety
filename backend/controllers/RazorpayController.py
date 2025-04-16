from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import razorpay
import hmac
import hashlib
import json

# Request models
class CreateOrderRequest(BaseModel):
    amount: int
    currency: str
    receipt: str
    payment_details: dict = None

class VerifyOrderRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    payment_details: dict = None

# Razorpay credentials - move these to environment variables in production
RAZORPAY_KEY_ID = "rzp_test_OSxHecT45UpnWE"
RAZORPAY_KEY_SECRET = "J1lHgrxiphNtLnTamt2VJmKp"  # Keep this secret in env variables

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

async def create_order(data: CreateOrderRequest):
    try:
        # Log the incoming request data for debugging
        # print(f"Creating order with data: {data.dict()}")
        
        # amount should already be in paise (smallest currency unit)
        # no need to multiply by 100 if the frontend is already sending in paise
        options = {
            "amount": data.amount,  # amount in paise
            "currency": data.currency,
            "receipt": data.receipt
        }
        
        # Create the order
        order = razorpay_client.order.create(options)
        # print(f"Order created successfully: {order}")
        
        return order
    except Exception as e:
        # print(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

async def verify_order(data: VerifyOrderRequest):
    try:
        # Log the verification request for debugging
        # print(f"Verifying order: {data.dict()}")
        
        # Create signature verification string
        params_dict = {
            'razorpay_order_id': data.razorpay_order_id,
            'razorpay_payment_id': data.razorpay_payment_id,
            'razorpay_signature': data.razorpay_signature
        }
        
        # Verify the signature using Razorpay's built-in method
        # This is more reliable than implementing your own HMAC
        is_valid_signature = razorpay_client.utility.verify_payment_signature(params_dict)
        
        # print(f"Signature verification result: {is_valid_signature}")
        
        # If we're here, the signature was valid (otherwise verify_payment_signature would have raised an exception)
        # Update your database with payment details here
        # ...
        
        return {"status": "success", "message": "Payment verified successfully"}
        
    except razorpay.errors.SignatureVerificationError as e:
        # print(f"Signature verification failed: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        # print(f"Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")