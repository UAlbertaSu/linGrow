import email
from xml.dom import ValidationErr
from rest_framework import serializers
from account.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .utils import Util

class UserRegistrationSerializer(serializers.ModelSerializer):
    #Confirm password in Registration request
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ('email', 'name', 'tc', 'password', 'password2')
        extra_kwargs = {'password': {'write_only': True}}

    #Validate password
    def validate(self, data):
        password = data['password']
        password2 = data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email', 'name']

class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    class Meta:
        fields = ['password', 'password2']

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        user.set_password(password)
        user.save()
        return data

class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            print('Encoded uid: ', uid)
            token = PasswordResetTokenGenerator().make_token(user)
            print('Password reset token: ', token)
            link = 'http://localhost:8000/api/user/reset/'+uid+'/'+token
            print('Password reset link: ', link)
            data = {
                'email_subject': 'Password Reset',
                'email_body': 'Hi, Please use the link below to reset your password:\n'+link,
                'to_email': user.email
            }
            Util.send_email(data)
            return attrs
        else:
            raise serializers.ValidationError({'email':'Email does not exist'})

class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=255, write_only=True)
    password2 = serializers.CharField(min_length=6, max_length=255, write_only=True)

    class Meta:
        fields = ['password', 'password2', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError('Passwords must match')
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is not valid or expired.')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError('Token is not valid or expired.')
