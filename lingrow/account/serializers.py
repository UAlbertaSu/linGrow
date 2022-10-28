from rest_framework import serializers
from account.models import User, Parent, Teacher, Researcher, Admin
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .enums import UserType
from .utils import Util
from chat.models import UserProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    '''
        Serializer for user registration endpoint.
    '''
    #Confirm password in Registration request
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    # add more optional fields for different user types here
    child_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    middle_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name','user_type', 'password', 'password2','child_name','middle_name')
        extra_kwargs = {'password': {'write_only': True}}

    #Validate password
    def validate(self, data):
        '''
            Validate password and password2 fields
        '''
        password = data['password']
        password2 = data['password2']
        user_type = data['user_type']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        valid_user_types = [user_type[0] for user_type in User.USER_TYPE_CHOICES]
        if user_type not in valid_user_types:
            raise serializers.ValidationError({'user_type': 'User type is not valid.'})
        return data

    def create(self, validated_data):
        '''
            Create user and user type object
        '''
        user = None
        user_type = validated_data['user_type']
        # validate user type fields here (a bit messy at the moment)
        if user_type == UserType.PARENT.value:
            if not validated_data.get('child_name'):
                raise serializers.ValidationError({'child_name': 'This field is required.'})
            user = User.objects.create_user(**validated_data)
            UserProfile.objects.create(user=user)
            parent = Parent(user=user,child_name=validated_data.get('child_name'))
            parent.save()
        elif user_type == UserType.TEACHER.value:
            user = User.objects.create_user(**validated_data)
            teacher = Teacher(user=user)
            teacher.save()
            UserProfile.objects.create(user=user)
        elif user_type == UserType.RESEARCHER.value:
            user = User.objects.create_user(**validated_data)
            researcher = Researcher(user=user)
            researcher.save()
            UserProfile.objects.create(user=user)
        elif user_type == UserType.ADMIN.value:
            user = User.objects.create_user(**validated_data)
            admin = Admin(user=user)
            admin.save()
            UserProfile.objects.create(user=user)
        else:
            raise serializers.ValidationError({'user_type': 'User type is not valid.'})
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    '''
        Serializer for user login endpoint.
    '''
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
    '''
        Serializer for user profile endpoint.
    '''
    class Meta:
        model = User
        fields = ['id','email', 'first_name','middle_name','last_name','user_type']
        read_only_fields = ['id','user_type']

class ParentProfileSerializer(serializers.ModelSerializer):
    '''
        Serializer for parent profile endpoint.
    '''
    user = UserProfileSerializer()
    class Meta:
        model = Parent
        fields = '__all__'

class TeacherProfileSerializer(serializers.ModelSerializer):
    '''
        Serializer for teacher profile endpoint.
    '''
    user = UserProfileSerializer()
    class Meta:
        model = Teacher
        fields = '__all__'

class ResearcherProfileSerializer(serializers.ModelSerializer):
    '''
        Serializer for researcher profile endpoint.
    '''
    user = UserProfileSerializer()
    class Meta:
        model = Researcher
        fields = '__all__'

class AdminProfileSerializer(serializers.ModelSerializer):
    '''
        Serializer for admin profile endpoint.
    '''
    user = UserProfileSerializer()
    class Meta:
        model = Admin
        fields = '__all__'

class UserChangePasswordSerializer(serializers.Serializer):
    '''
        Serializer for user change password endpoint.
    '''
    old_password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    class Meta:
        fields = ['old_password','password', 'password2']

    def validate(self, data):
        old_password = data.get('old_password')
        password = data.get('password')
        password2 = data.get('password2')
        user = self.context.get('user')
        if not user.check_password(old_password):
            raise serializers.ValidationError({'old_password': 'Old password is incorrect'})
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        user.set_password(password)
        user.save()
        return data

class SendPasswordResetEmailSerializer(serializers.Serializer):
    '''
        Serializer for sending password reset email endpoint.
    '''
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            link = 'http://localhost:8000/api/user/reset/'+uid+'/'+token
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
    '''
        Serializer for user password reset endpoint.
    '''
    old_password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password = serializers.CharField(min_length=6, style={'input_type':'password'}, max_length=255, write_only=True)
    password2 = serializers.CharField(min_length=6, style={'input_type':'password'}, max_length=255, write_only=True)

    class Meta:
        fields = ['password', 'password2', 'token', 'uidb64', 'old_password']

    def validate(self, attrs):
        try:
            old_password = attrs.get('old_password')
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError('Passwords must match')
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not user.check_password(old_password):
                raise serializers.ValidationError({'old_password': 'Old password is incorrect'})
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is not valid or expired.')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError('Token is not valid or expired.')
