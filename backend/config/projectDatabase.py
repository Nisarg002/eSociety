from motor.motor_asyncio import AsyncIOMotorClient  

MONGO_URL = "mongodb://localhost:27017" 
DATABASE_NAME = "project_database" 



client = AsyncIOMotorClient(MONGO_URL) 
db = client[DATABASE_NAME] 
role_collection = db["roles"] 
user_collection = db["users"] 
society_collection = db["societies"]
complaint_collection = db["complaints"]
booking_collection = db["bookings"]
visitor_collection = db["visitors"]
notice_collection = db["notices"]
staff_collection = db["staff"]
city_collection = db["cities"] 
state_collection = db["states"]
payment_collection = db["payments"] 
razorpay_collection = db["razorpay"]
payment_status_collection = db["payment_status"]
