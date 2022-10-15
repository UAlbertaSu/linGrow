from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,\
                                UserChangePasswordSerializer, SendPasswordResetEmailSerializer,\
                                UserPasswordResetSerializer, ParentProfileSerializer, TeacherProfileSerializer,\
                                ResearcherProfileSerializer, AdminProfileSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from .models import User, Parent, Teacher, Researcher, Admin
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .enums import UserType
from drf_yasg.utils import swagger_auto_schema


class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    @swagger_auto_schema(request_body=UserRegistrationSerializer,operation_description="Register a new user",responses={201: "{'token': {}, 'message': 'Registration Successful'}" ,400: "Bad Request"})
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token':token,'message':'Registration Successful'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Generate token manually 
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    @swagger_auto_schema(request_body=UserLoginSerializer, operation_description="Login a user",responses={200: "{'token': {}, 'message': 'Login Successful'}" ,404: "Invalid Credentials", 400: "Bad Request"})
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email=email, password=password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token':token,'message':'Login Successful'},status=status.HTTP_200_OK)
            else:
                return Response({'error':'Invalid Credentials'},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(operation_description="View user profile",responses={200: UserProfileSerializer,400: "Bad Request"})
    def get(self, request, format=None):
        user = request.user
        if user.user_type == UserType.PARENT.value:
            parent = Parent.objects.get(user=user)
            serializer = ParentProfileSerializer(parent)
        elif user.user_type == UserType.TEACHER.value:
            teacher = Teacher.objects.get(user=user)
            serializer = TeacherProfileSerializer(teacher)
        elif user.user_type == UserType.RESEARCHER.value:
            researcher = Researcher.objects.get(user=user)
            serializer = ResearcherProfileSerializer(researcher)
        elif user.user_type == UserType.ADMIN.value:
            admin = Admin.objects.get(user=user)
            serializer = AdminProfileSerializer(admin)
        else:
            serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, format=None):
        user = request.user
        user_serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
        if user.user_type == UserType.PARENT.value:
            parent = Parent.objects.get(user=user)
            serializer = ParentProfileSerializer(parent, data=request.data, partial=True)
        elif user.user_type == UserType.TEACHER.value:
            teacher = Teacher.objects.get(user=user)
            serializer = TeacherProfileSerializer(teacher, data=request.data, partial=True)
        elif user.user_type == UserType.RESEARCHER.value:
            researcher = Researcher.objects.get(user=user)
            serializer = ResearcherProfileSerializer(researcher, data=request.data, partial=True)
        elif user.user_type == UserType.ADMIN.value:
            admin = Admin.objects.get(user=user)
            serializer = AdminProfileSerializer(admin, data=request.data, partial=True)
        else:
            serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(request_body=UserChangePasswordSerializer, operation_description="Change user password",responses={200: "{'message': 'Password Changed Successfully'}" ,400: "Bad Request"})
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    @swagger_auto_schema(request_body=SendPasswordResetEmailSerializer, operation_description="Send password reset email",responses={200: "{'message': 'Password reset link send. Please check your email.'}" ,400: "Bad Request"})
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        return Response({'message':'Password reset link send. Please check your email.'},status=status.HTTP_200_OK)

class UserPaswordResetView(APIView):
    renderer_classes = [UserRenderer]
    @swagger_auto_schema(request_body=UserPasswordResetSerializer, operation_description="Reset user password",responses={200: "{'message': 'Password Changed Successfully'}" ,400: "Bad Request"})
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUserIDListView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, id, format=None):
        if not User.objects.filter(id=id).exists():
            return Response({'error':'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=id)
        if user.user_type == UserType.PARENT.value:
            parent = Parent.objects.get(user=user)
            serializer = ParentProfileSerializer(parent)
        elif user.user_type == UserType.TEACHER.value:
            teacher = Teacher.objects.get(user=user)
            serializer = TeacherProfileSerializer(teacher)
        elif user.user_type == UserType.RESEARCHER.value:
            researcher = Researcher.objects.get(user=user)
            serializer = ResearcherProfileSerializer(researcher)
        else:
            serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id, format=None):
        if not User.objects.filter(id=id).exists():
            return Response({'error':'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=id)
        user_serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
        if user.user_type == UserType.PARENT.value:
            parent = Parent.objects.get(user=user)
            serializer = ParentProfileSerializer(parent, data=request.data, partial=True)
        elif user.user_type == UserType.TEACHER.value:
            teacher = Teacher.objects.get(user=user)
            serializer = TeacherProfileSerializer(teacher, data=request.data, partial=True)
        elif user.user_type == UserType.RESEARCHER.value:
            researcher = Researcher.objects.get(user=user)
            serializer = ResearcherProfileSerializer(researcher, data=request.data, partial=True)
        else:
            serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUserListView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, user_cat, format=None):
        if type(user_cat) == str:
            if user_cat == 'all':
                users = User.objects.all()
                serializer = UserProfileSerializer(users, many=True)
            elif user_cat == 'parents':
                users = Parent.objects.all()
                serializer = ParentProfileSerializer(users, many=True)
            elif user_cat == 'teachers':
                users = Teacher.objects.all()
                serializer = TeacherProfileSerializer(users, many=True)
            elif user_cat == 'researchers':
                users = Researcher.objects.all()
                serializer = ResearcherProfileSerializer(users, many=True)
            else:
                return Response({'error':'Invalid Argument'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_200_OK)
        