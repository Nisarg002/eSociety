from fastapi import FastAPI

from routes.ProjectRoleRoutes import router as project_role_router
from routes.ProjectUserRoutes import router as project_user_router
from routes.ProjectSocietyRoutes import router as project_society_router
from routes.ProjectComplaintsRoutes import router as project_complaints_router
from routes.ProjectBookingRoutes import router as project_booking_router
from routes.ProjectVisitorsRoutes import router as project_visitors_router
from routes.ProjectNoticeRoutes import router as project_notice_router
from routes.ProjectStaffRoutes import router as project_staff_router
from routes.ProjectPaymentRoutes import router as project_payment_router
from routes.RazorpayRoutes import router as project_razorpay_router

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


app = FastAPI()

# Serve uploaded images
# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(project_user_router)
app.include_router(project_role_router)
app.include_router(project_society_router)
app.include_router(project_complaints_router)
app.include_router(project_booking_router)
app.include_router(project_visitors_router)
app.include_router(project_notice_router)
app.include_router(project_staff_router)
app.include_router(project_payment_router)
app.include_router(project_razorpay_router)

@app.get("/")
async def root():
  return {"message":"FastAPI is running!"}
