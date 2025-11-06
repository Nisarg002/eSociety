from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from controllers.RazorpayController import create_order, verify_order
from controllers.RazorpayController import CreateOrderRequest, VerifyOrderRequest
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["Project"])

@router.post("/payment/create_order/")
async def create_order_route(request: Request, data: CreateOrderRequest):
    try:
        # Log the incoming request data
        request_data = await request.json()
        logger.info(f"Received create_order request: {request_data}")
        
        order = await create_order(data)
        logger.info(f"Order created successfully: {order}")
        
        return JSONResponse(status_code=200, content=order)
    except HTTPException as e:
        logger.error(f"HTTP error in create_order: {e.detail}")
        return JSONResponse(status_code=e.status_code, content={"status": "error", "detail": e.detail})
    except Exception as e:
        logger.error(f"Unexpected error in create_order: {str(e)}")
        return JSONResponse(status_code=500, content={"status": "error", "detail": f"Internal server error: {str(e)}"})

@router.post("/payment/verify_order/")
async def verify_order_route(request: Request, data: VerifyOrderRequest):
    try:
        # Log the incoming verification request
        request_data = await request.json()
        logger.info(f"Received verify_order request: {request_data}")
        
        # Remove sensitive data from logs
        if "razorpay_signature" in request_data:
            log_data = request_data.copy()
            log_data["razorpay_signature"] = "***REDACTED***"
            logger.info(f"Verification data (sanitized): {log_data}")
        
        verification = await verify_order(data)
        logger.info("Payment verification successful")
        
        return JSONResponse(status_code=200, content=verification)
    except HTTPException as e:
        logger.error(f"HTTP error in verify_order: {e.detail}")
        return JSONResponse(status_code=e.status_code, content={"status": "error", "detail": e.detail})
    except Exception as e:
        logger.error(f"Unexpected error in verify_order: {str(e)}")
        return JSONResponse(status_code=500, content={"status": "error", "detail": f"Internal server error: {str(e)}"})