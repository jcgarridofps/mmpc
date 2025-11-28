import os
import smtplib
from email.message import EmailMessage
from email.mime.text import MIMEText


def send_email(to, subject, message):
    try:
        email_address = os.environ.get("EMAIL_ADDRESS")
        email_password = os.environ.get("EMAIL_PASSWORD")
        email_server_smtp = os.environ.get("EMAIL_SERVER_SMTP")
        email_port_smtp = os.environ.get("EMAIL_PORT_SMTP")

        if email_address is None or email_password is None:
            # no email address or password
            # something is not configured properly
            print("Did you set email address and password correctly?")
            return False

        # create email
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = email_address
        msg['To'] = to


        msg.add_alternative(message, subtype='html')

        # send email
        #with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        with smtplib.SMTP_SSL(email_server_smtp, email_port_smtp) as smtp:
            smtp.login(email_address, email_password)
            smtp.send_message(msg)
        return True


    except Exception as e:
        print("Problem during send email")
        print(str(e))
    return False