from fastapi import APIRouter
from models.ProjectBookingModel import Booking,BookingUpdate
from controllers.ProjectBookingController import addBooking,getAllBookings,deleteBooking,updateBooking,getBookingById,getBookingByUserId

router = APIRouter(tags=["Project"])

@router.post("/booking/")
async def post_booking(booking: Booking):
    return await addBooking(booking)

@router.get("/booking/")
async def get_bookings():
    return await getAllBookings()

@router.get("/booking_user/{userId}")
async def get_booking_by_user_id(userId:str):
    return await getBookingByUserId(userId)

@router.get("/booking/{bookingId}")
async def get_booking_by_id(bookingId:str):
    return await getBookingById(bookingId)

@router.patch("/booking/")
async def update_booking(booking:BookingUpdate):
    return await updateBooking(booking)

@router.delete("/booking/{bookingId}")
async def delete_booking(bookingId:str):
    return await deleteBooking(bookingId)