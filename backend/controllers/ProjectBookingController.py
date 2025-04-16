from config.projectDatabase import booking_collection
from models.ProjectBookingModel import Booking,BookingOut,BookingUpdate
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi import HTTPException

async def addBooking(booking: Booking):
    booking.status = "pending"
    user_id = ObjectId(booking.user_id)
    result = await booking_collection.insert_one(booking.dict())
    return JSONResponse(status_code=201, content={"message": "Booking added successfully"})

async def getAllBookings():
    bookings = await booking_collection.find().to_list(length=None)
    return [BookingOut(**booking) for booking in bookings]

async def getBookingByUserId(userId: str):
    bookings = await booking_collection.find({"user_id": ObjectId(userId)}).to_list(length=None)
    if bookings is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return [BookingOut(**booking) for booking in bookings]

async def getBookingById(bookingId: str):
    booking = await booking_collection.find_one({"_id": ObjectId(bookingId)})
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingOut(**booking)

async def deleteBooking(bookingId: str):
    result = await booking_collection.delete_one({"_id": ObjectId(bookingId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return JSONResponse(status_code=200, content={"message": "Booking deleted successfully"})

# update status
async def updateBooking(booking:BookingUpdate):
    result = await booking_collection.update_one(
        {"_id": ObjectId(booking.bookingId)},
        {"$set": {"status": booking.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return JSONResponse(status_code=200, content={"message": "Booking status updated successfully"})