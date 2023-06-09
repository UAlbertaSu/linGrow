from rest_framework import serializers
from account.models import User, Parent, Teacher, Researcher, Admin, Child
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .enums import UserType
from .utils import Util
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from admin_school_management.models import School, Classroom

class UserRegistrationSerializer(serializers.ModelSerializer):
    '''
        Serializer for user registration endpoint.
    '''
    #Confirm password in Registration request
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    middle_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    phone = serializers.IntegerField(required=False)
    researcher_id = serializers.CharField(max_length=255, required=False, allow_blank=True)
    teacher_id = serializers.CharField(max_length=255, required=False, allow_blank=True)
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False)
    classroom = serializers.PrimaryKeyRelatedField(queryset=Classroom.objects.all(), required=False)
    classrooms = serializers.PrimaryKeyRelatedField(many=True, queryset=Classroom.objects.all(), required=False)

    class Meta:
        model = User
        fields = ('id','email', 'first_name', 'last_name','user_type', 'password', 'password2','middle_name', 'phone', 'researcher_id', 'teacher_id'
                 ,'school', 'classroom', 'classrooms')
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
        if user_type == UserType.TEACHER.value:
            school = data.get('school')
            classrooms = data.get('classrooms')
            if not school and classrooms:
                raise serializers.ValidationError({'school': 'School is required for adding classrooms.'})
            if classrooms:
                for classroom in classrooms:
                    if classroom.school != school:
                        raise serializers.ValidationError({'classrooms': 'Classrooms must belong to the same school.'})
        validate_password(password)
        return data

    def create(self, validated_data):
        '''
            Create user and user type object
        '''
        delete_user = False
        message = None
        user_type = validated_data['user_type']
        try:
            user = User.objects.create_user(**validated_data)
        except ValidationError as e:
            raise serializers.ValidationError(e)
    
        if user_type == UserType.PARENT.value:
            parent = Parent(user=user)
            try:
                parent.save()
            except Exception as e:
                delete_user = True
                message = e
        elif user_type == UserType.TEACHER.value:
            
            teacher = Teacher(user=user, teacher_id=validated_data.get('teacher_id'), school=validated_data.get('school'))
            if validated_data.get('classroom'):
                teacher.classrooms.add(validated_data.get('classroom'))
            try:
                teacher.save()
            except Exception as e:
                delete_user = True
                message = e
        elif user_type == UserType.RESEARCHER.value:
            researcher = Researcher(user=user, researcher_id=validated_data.get('researcher_id'))
            try:
                researcher.save()
            except Exception as e:
                delete_user = True
                message = e
        elif user_type == UserType.ADMIN.value:
            admin = Admin(user=user)
            try:
                admin.save()
            except Exception as e:
                delete_user = True
                message = e
        else:
            raise serializers.ValidationError({'user_type': 'User type is not valid.'})
        if delete_user:
            user.delete()
            raise serializers.ValidationError(message)
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
        read_only_fields = ['user_type']

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

    def validate(self, data):
        instance = self.instance
        school = data.get('school', instance.school)
        old_classrooms = instance.classrooms.all()
        new_classrooms = data.get('classrooms', old_classrooms)
        if not school and new_classrooms:
            raise serializers.ValidationError({'school': 'School is required for adding classrooms.'})
        if new_classrooms:
            for classroom in new_classrooms:
                if classroom.school != school:
                    raise serializers.ValidationError({'classrooms': 'Classroom must be in the same school as teacher.'})
        return data

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
        validate_password(password)
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
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not user.check_password(old_password):
                raise serializers.ValidationError({'old_password': 'Old password is incorrect'})
            if password != password2:
                raise serializers.ValidationError('Passwords must match')
            validate_password(password)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is not valid or expired.')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError('Token is not valid or expired.')

class ChildSerializer(serializers.ModelSerializer):
    '''
        Serializer for child endpoint.
    '''
    middle_name = serializers.CharField(max_length=64, required=False)
    student_id = serializers.CharField(max_length=30, required=False)
    class Meta:
        model = Child
        fields = '__all__'

class ChildEditSerializerParent(serializers.ModelSerializer):
    '''
        Serializer for child endpoint.
    '''
    middle_name = serializers.CharField(max_length=64, required=False)
    student_id = serializers.CharField(max_length=30, required=False)
    class Meta:
        model = Child
        fields = '__all__'
        read_only_fields = ['parent']
