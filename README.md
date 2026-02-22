Smart e-Society Hub is a web-based society management system built using the FARM Stack (FastAPI, React, MongoDB).
It allows Admins, Residents, and Security Guards to manage daily society operations efficiently.

Features
- Role-based access: Admin, Resident, Security Guard
- Online maintenance payment via Razorpay
- Notice posting and viewing
- Staff and visitor management
- Common area booking requests
- Email notifications
- Password encryption for user security

Demo Login Credentials
- Admin
      Email: nisargadmin@yopmail.com
      Password: Nisarg@1234
- Resident
      Email: nisargresident@yopmail.com
      Password: Nisarg@1234
- Guard
      Email: abcsecurity@yopmail.com
      Password: Abc@123

(For demo use only)

Tech Stack
- Frontend: React
- Backend: FastAPI
- Database: MongoDB
- Payment Gateway: Razorpay

Setup Instructions

Clone the repository
- git clone https://github.com/yourusername/esociety.git
- cd esociety
Backend setup
- cd backend
- pip install -r requirements.txt
- uvicorn main:app --reload
Frontend setup
- cd frontend
- npm install
- npm run dev
Access
- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000

 Known Issues
- Some features may not work perfectly in the hosted version.
- Minor bugs are being fixed in upcoming updates.
  
Author
Nisarg Mistry






