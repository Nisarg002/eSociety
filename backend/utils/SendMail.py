import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv

# 1. This finds your .env even if your script is inside a /utils or /backend folder
# It looks for the .env file in the directory above this one
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))

# 2. Assign environment variables
# Note: Ensure these names match your .env EXACTLY
API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SMTP_EMAIL") # Your verified Brevo login email

def send_mail(to_email: str, subject: str, html_content: str):
    # Setup configuration
    configuration = sib_api_v3_sdk.Configuration()
    
    # DEBUG: Check if key is loaded
    if not API_KEY:
        print("ERROR: BREVO_API_KEY is empty. Check your .env file path!")
        return
        
    configuration.api_key['api-key'] = API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": to_email}],
        sender={"email": SENDER_EMAIL, "name": "Smart E-Society Hub"},
        subject=subject,
        html_content=html_content
    )

    try:
        print(f"Sending to {to_email}...")
        api_response = api_instance.send_transac_email(send_smtp_email)
        print("SUCCESS!")
        return api_response
    except ApiException as e:
        print(f"API ERROR: {e}")
        return None

# if __name__ == "__main__":
#     # Test call
#     send_mail("nisargadmin@yopmail.com", "Env Test", "<h1>Sent using .env!</h1>")


# from fastapi import FastAPI
# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText
# from email.mime.base import MIMEBase
# from email import encoders
# from dotenv import load_dotenv
# import os


# load_dotenv()

# SMTP_SERVER = os.getenv("SMTP_SERVER") or ""
# SMTP_PORT = os.getenv("SMTP_PORT")  or 587
# SMTP_EMAIL =os.getenv("SMTP_EMAIL") or ""
# SMTP_PASSWORD=os.getenv("SMTP_PASSWORD") or "" 
# print(SMTP_EMAIL)

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



# import ssl  
# Add this import at the top
# def send_mail(to_email: str, subject: str, text: str):
#     msg = MIMEMultipart()
#     msg['From'] = SMTP_EMAIL
#     msg['To'] = to_email
#     msg['Subject'] = subject
#     msg.attach(MIMEText(text, 'html'))
    
#     # 1. Create a secure SSL context
#     context = ssl.create_default_context()
    
#     # 2. Use SMTP_SSL instead of SMTP
#     # 3. Pass the context
#     with smtplib.SMTP_SSL(SMTP_SERVER, int(SMTP_PORT), context=context) as server:
#         # Note: server.starttls() is REMOVED (not needed for 465)
#         server.login(SMTP_EMAIL, SMTP_PASSWORD)
#         server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
    
#     return {"message": "Mail sent successfully"}

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