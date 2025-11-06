from motor.motor_asyncio import AsyncIOMotorClient  
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME") 



client = AsyncIOMotorClient(MONGO_URL) 
db = client[DATABASE_NAME] 
booking_collection = db["bookings"]
complaint_collection = db["complaints"]
notice_collection = db["notices"]
payment_collection = db["payments"] 
role_collection = db["roles"] 
society_collection = db["societies"]
staff_collection = db["staff"]
user_collection = db["users"] 
visitor_collection = db["visitors"]
