from fastapi import FastAPI
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv
import os
import ssl  # Add this import at the top

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER") or ""
SMTP_PORT = 465
# SMTP_PORT = os.getenv("SMTP_PORT")  or 587
SMTP_EMAIL =os.getenv("SMTP_EMAIL") or ""
SMTP_PASSWORD=os.getenv("SMTP_PASSWORD") or "" 
print(SMTP_EMAIL)

# def send_mail(to_email:str,subject:str,text:str):
#     msg = MIMEMultipart()
#     msg['From'] = SMTP_EMAIL
#     msg['To'] = to_email
#     msg['Subject'] = subject
#     msg.attach(MIMEText(text,'html'))
    
#     #connect to mail server....
#     server = smtplib.SMTP(SMTP_SERVER,SMTP_PORT)
#     server.starttls()
#     server.login(SMTP_EMAIL,SMTP_PASSWORD)
#     server.sendmail(SMTP_EMAIL,to_email,msg.as_string())
#     server.quit()
    
#     return {"message":"Mail sent successfully"}

def send_mail(to_email: str, subject: str, text: str):
    msg = MIMEMultipart()
    msg['From'] = SMTP_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(text, 'html'))
    
    # 1. Create a secure SSL context
    context = ssl.create_default_context()
    
    # 2. Use SMTP_SSL instead of SMTP
    # 3. Pass the context
    with smtplib.SMTP_SSL(SMTP_SERVER, int(SMTP_PORT), context=context) as server:
        # Note: server.starttls() is REMOVED (not needed for 465)
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
    
    return {"message": "Mail sent successfully"}

# send_mail("nisargadmin@yopmail.com","Test Mail","This is a test mail from fast...")

# import resend
# import os
# from dotenv import load_dotenv

# load_dotenv()

# resend.api_key = os.getenv("RESEND_API_KEY")
# print(resend.api_key)

# def send_mail(to_email: str, subject: str, text: str):
#     try:
#         response = resend.Emails.send({
#             "from": "onboarding@resend.dev",
#             "to": to_email,
#             "subject": subject,
#             "html": text
#         })
#         print("RESPONSE:", response)
#         return {"message": "Mail sent successfully"}
#     except Exception as e:
#         print("ERROR:", str(e))
#         return {"error": str(e)}
    
# send_mail("nisargadmin@yopmail.com","Test Mail","This is a test mail from fast...")