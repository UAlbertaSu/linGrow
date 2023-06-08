from django.core.mail import EmailMessage
import os
from .models import User

class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['email_subject'],
            body=data['email_body'],
            from_email=os.environ.get('EMAIL_FROM'),
            to=[data['to_email']])
        email.send()
        
    @staticmethod
    def generate_password():
        password = User.objects.make_random_password(length=5, allowed_chars="abcdefghjkmnpqrstuvwxyz") + \
                    User.objects.make_random_password(length=5, allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZ") + \
                    User.objects.make_random_password(length=3, allowed_chars="23456789") + \
                    User.objects.make_random_password(length=2, allowed_chars="~!@#$%^&*()_+{}\":;'[]")
        return password