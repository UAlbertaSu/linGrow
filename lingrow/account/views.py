from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,\
                                UserChangePasswordSerializer, SendPasswordResetEmailSerializer,\
                                UserPasswordResetSerializer, ParentProfileSerializer, TeacherProfileSerializer,\
                                ResearcherProfileSerializer, AdminProfileSerializer, ChildSerializer, ChildEditSerializerParent
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from .models import User, Parent, Teacher, Researcher, Admin, Child
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .enums import UserType
from drf_yasg.utils import swagger_auto_schema
from .permissions import IsParent, IsTeacher, IsResearcher
from group_management.models import ParentGroup, TeacherGroup
from .utils import Util


class UserRegistrationView(APIView):
    '''
        View to register a new user
    '''
    renderer_classes = [UserRenderer]
    @swagger_auto_schema(request_body=UserRegistrationSerializer,operation_description="Register a new user",responses={201: "{'token': {}, 'message': 'Registration Successful'}" ,400: "Bad Request"})
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token':token,'message':'Registration Successful', 'user': serializer.data},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_tokens_for_user(user):
    '''
        Function to get tokens for a user
    '''
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserLoginView(APIView):
    '''
        View to login a user
    '''
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
    '''
        View to get user profile
    '''
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

    @swagger_auto_schema(request_body=UserProfileSerializer,operation_description="Update user profile",responses={200: UserProfileSerializer,400: "Bad Request"})
    def patch(self, request, format=None):
        '''
            View to update user profile
        '''
        user = request.user
        user_serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if user.is_teacher():
            teacher = Teacher.objects.get(user=user)
            og_school = teacher.school
            og_classrooms = set(teacher.classrooms.all())
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
            new_user = serializer.save()
            if user.is_teacher():
                new_teacher = Teacher.objects.get(user=new_user)
                if new_teacher.school != og_school:
                    all_groups = TeacherGroup.objects.filter(school=og_school)
                    for group in all_groups:
                        if teacher in group.teacher.all():
                            group.teacher.remove(teacher)
                            group.save()
                new_classrooms = set(new_teacher.classrooms.all())
                if new_classrooms != og_classrooms:
                    delete_classrooms = og_classrooms - new_classrooms
                    add_classrooms = new_classrooms - og_classrooms
                    for classroom in delete_classrooms:
                        all_groups = TeacherGroup.objects.filter(school=new_teacher.school,classroom=classroom)
                        for group in all_groups:
                            if teacher in group.teacher.all():
                                group.teacher.remove(teacher)
                                group.save()
                    for classroom in add_classrooms:
                        teacher_group = TeacherGroup.objects.get(classroom=classroom,school=new_teacher.school, owner__isnull=True)
                        teacher_group.teacher.add(new_teacher)
                        teacher_group.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserChangePasswordView(APIView):
    '''
        View to change user password
    '''
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=UserChangePasswordSerializer, operation_description="Change user password",responses={200: "{'message': 'Password Changed Successfully'}" ,400: "Bad Request"})
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendPasswordResetEmailView(APIView):
    '''
        View to send password reset email
    '''
    renderer_classes = [UserRenderer]
    @swagger_auto_schema(request_body=SendPasswordResetEmailSerializer, operation_description="Send password reset email",responses={200: "{'message': 'Password reset link send. Please check your email.'}" ,400: "Bad Request"})
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        return Response({'message':'Password reset link send. Please check your email.'},status=status.HTTP_200_OK)


class UserPaswordResetView(APIView):
    '''
        View to reset user password
    '''
    renderer_classes = [UserRenderer]
    @swagger_auto_schema(request_body=UserPasswordResetSerializer, operation_description="Reset user password",responses={200: "{'message': 'Password Changed Successfully'}" ,400: "Bad Request"})
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserIDListView(APIView):
    '''
        View to let admin get all user id
    '''
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @swagger_auto_schema(operation_description="Get user with ID",responses={200: UserProfileSerializer,400: "Bad Request"})
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

    @swagger_auto_schema(request_body=UserProfileSerializer,operation_description="Update user profile",responses={200: UserProfileSerializer,400: "Bad Request"})
    def patch(self, request, id, format=None):
        '''
            View to let admin update user profile
        '''
        if not User.objects.filter(id=id).exists():
            return Response({'error':'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=id)
        user_serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if user.is_teacher():
            teacher = Teacher.objects.get(user=user)
            og_school = teacher.school
            og_classrooms = set(teacher.classrooms.all())
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
            new_user = serializer.save()
            if user.is_teacher():
                new_teacher = Teacher.objects.get(user=new_user)
                if new_teacher.school != og_school:
                    all_groups = TeacherGroup.objects.filter(school=og_school)
                    for group in all_groups:
                        if teacher in group.teacher.all():
                            group.teacher.remove(teacher)
                            group.save()
                new_classrooms = set(new_teacher.classrooms.all())
                if new_classrooms != og_classrooms:
                    delete_classrooms = og_classrooms - new_classrooms
                    add_classrooms = new_classrooms - og_classrooms
                    for classroom in delete_classrooms:
                        all_groups = TeacherGroup.objects.filter(school=new_teacher.school,classroom=classroom)
                        for group in all_groups:
                            if teacher in group.teacher.all():
                                group.teacher.remove(teacher)
                                group.save()
                    for classroom in add_classrooms:
                        teacher_group = TeacherGroup.objects.get(classroom=classroom,school=new_teacher.school, owner__isnull=True)
                        teacher_group.teacher.add(new_teacher)
                        teacher_group.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(operation_description="Delete user",responses={200: "{'message': 'User deleted successfully'}",400: "Bad Request"})
    def delete(self, request, id, format=None):
        '''
            View to let admin delete user
        '''
        if not User.objects.filter(id=id).exists():
            return Response({'error':'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=id)
        user.delete()
        return Response({'msg':'User deleted successfully'}, status=status.HTTP_200_OK)


class AdminUserListView(APIView):
    '''
        View to let admin get all user
    '''
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @swagger_auto_schema(operation_description="Get all users",responses={200: UserProfileSerializer(many=True),400: "Bad Request"})
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

class AdminAddUsersView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        if not request.user.is_admin():
            return Response({'error':'You are not an admin'}, status=status.HTTP_400_BAD_REQUEST)
        users_to_create = request.data.get('users')
        if users_to_create is None:
            return Response({'error':'No users to create'}, status=status.HTTP_400_BAD_REQUEST)
        created_users = []
        failed_users = []
        failed_children = []
        for user in users_to_create:
            password = Util.generate_password()
            user['password'], user['password2'] = password, password
            user_serializer = UserRegistrationSerializer(data=user)
            if user_serializer.is_valid():
                user = user_serializer.save()
                user_data = user_serializer.data
                user_data['password'] = password
                created_users.append(user_data)
                children = user.get('children')
                if children is None:
                    continue
                if len(children) > 0 and not user.is_parent():
                    failed_children.append({'user': user_data.get('id'),"children":children, 'error':'User is not a parent'})
                elif len(children) > 0 and user.is_parent():
                    parent = Parent.objects.get(user=user)
                    for child in children:
                        child['parent'] = parent.id
                        child_serializer = ChildSerializer(data=child)
                        if child_serializer.is_valid():
                            child_serializer.save()
                        else:
                            child['error'] = child_serializer.errors
                            failed_children.append({'user': user_data.get('id'),"child":child})
            else:
                user.pop('password'), user.pop('password2')
                user['error'] = user_serializer.errors
                failed_users.append(user)
        msg = 'Users created successfully!'
        if len(failed_users) > 0 and len(failed_children) > 0:
            msg = 'Some users and children were not created successfully!'
        elif len(failed_users) > 0:
            msg = 'Some users were not created successfully!'
        elif len(failed_children) > 0:
            msg = 'Some children were not created successfully!'
        return Response({'msg':msg, 'not_created_users': failed_users ,'created_users': created_users}, status=status.HTTP_200_OK)

class GetUserView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated,IsParent|IsTeacher|IsResearcher]

    def get(self, request, id=None):
        if not id:
            return Response({'error':'Please provide an id'}, status=status.HTTP_400_BAD_REQUEST)
        if not User.objects.filter(id=id).exists():
            return Response({'error':'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if user.is_teacher():
            teacher = Teacher.objects.get(user=user)
            if not teacher.school:
                return Response({'error':'Teacher does not have a school'}, status=status.HTTP_400_BAD_REQUEST)
            queried_user = User.objects.get(id=id)
            if queried_user.is_teacher():
                queried_teacher = Teacher.objects.get(user=queried_user)
                if queried_teacher.school != teacher.school:
                    return Response({'error':'Teacher does not belong to your school'}, status=status.HTTP_400_BAD_REQUEST)
                return Response(TeacherProfileSerializer(queried_teacher).data, status=status.HTTP_200_OK)
            elif queried_user.is_parent():
                queried_parent = Parent.objects.get(user=queried_user)
                if Child.objects.filter(parent=queried_parent, school=teacher.school).count() == 0:
                    return Response({'error':'Parent does not belong to your school'}, status=status.HTTP_400_BAD_REQUEST)
                return Response(ParentProfileSerializer(queried_parent).data, status=status.HTTP_200_OK)
            else:
                return Response({'error':'Queried user is not a teacher or parent'}, status=status.HTTP_400_BAD_REQUEST)    
        elif user.is_researcher():
            queried_user = User.objects.get(id=id)
            if queried_user.is_parent():
                queried_parent = Parent.objects.get(user=queried_user)
                return Response(ParentProfileSerializer(queried_parent).data, status=status.HTTP_200_OK)
            elif queried_user.is_teacher():
                queried_teacher = Teacher.objects.get(user=queried_user)
                return Response(TeacherProfileSerializer(queried_teacher).data, status=status.HTTP_200_OK)
            else:
                return Response({'error':'Queried user is not a teacher or parent'}, status=status.HTTP_400_BAD_REQUEST)
        elif user.is_parent():
            queried_user = User.objects.get(id=id)
            if queried_user.is_teacher():
                queried_teacher = Teacher.objects.get(user=queried_user)
                if not queried_teacher.school:
                    return Response({'error':'Teacher does not have a school'}, status=status.HTTP_400_BAD_REQUEST)
                school = queried_teacher.school
                parent = Parent.objects.get(user=user)
                if Child.objects.filter(parent=parent, school=school).count() == 0:
                    return Response({'error':'Teacher does not belong to your school'}, status=status.HTTP_400_BAD_REQUEST)
                return Response(TeacherProfileSerializer(queried_teacher).data, status=status.HTTP_200_OK)
            else:
                return Response({'error':'Queried user is not a teacher'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ChildView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsParent]

    @swagger_auto_schema(operation_description="Add a new child",responses={200: ChildSerializer,400: "Bad Request"})
    def post(self, request, format=None):
        '''
            View to let parent add child
        '''
        user = request.user
        parent = Parent.objects.get(user=user)
        request.data['parent'] = parent
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            child = serializer.save()
            return Response({'msg':'Child Added Successfully', 'child': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Get all children",responses={200: ChildSerializer(many=True),400: "Bad Request"})
    def get(self,request, format=None):
        '''
            View to let parent get all child
        '''
        user = request.user
        parent = Parent.objects.get(user=user)
        children = Child.objects.filter(parent=parent)
        serializer = ChildSerializer(children, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Update child",responses={200: ChildSerializer,400: "Bad Request"})
    def patch(self, request, id, format=None):
        '''
            View to let parent update child
        '''
        user = request.user
        parent = Parent.objects.get(user=user)
        child = Child.objects.get(id=id)
        og_school = child.school
        og_classroom = child.classroom
        if child.parent != parent:
            return Response({'error':'Child does not belong to the parent'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ChildEditSerializerParent(child, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            new_child = serializer.save()
            if og_school != new_child.school:
                parent_groups = ParentGroup.objects.filter(school=og_school)
                for group in parent_groups:
                    if parent in group.parent.all():
                        group.parent.remove(parent)
                        group.save()
            if og_classroom != new_child.classroom:
                parent_groups = ParentGroup.objects.filter(school=og_school,classroom=og_classroom)
                for group in parent_groups:
                    if parent in group.parent.all():
                        group.parent.remove(parent)
                        group.save()
            return Response({'msg':'Child Updated Successfully', 'child': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete child",responses={200: "OK",400: "Bad Request"})
    def delete(self, request, id, format=None):
        '''
            View to let parent delete child
        '''
        user = request.user
        parent = Parent.objects.get(user=user)
        child = Child.objects.get(id=id)
        if child.parent != parent:
            return Response({'error':'Child does not belong to the parent'}, status=status.HTTP_400_BAD_REQUEST)
        child.delete()
        return Response({'msg':'Child Deleted Successfully'}, status=status.HTTP_200_OK)

class ChildAdminView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @swagger_auto_schema(operation_description="Get all children for a parent",responses={200: ChildSerializer(many=True),400: "Bad Request"})
    def get(self, request, pid, cid=None, format=None):
        '''
            View to let admin get child
        '''
        if not Parent.objects.filter(pk=pid).exists():
            return Response({'error':'Parent does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        parent = Parent.objects.get(pk=pid)
        if cid is None:
            children = Child.objects.filter(parent=parent)
            serializer = ChildSerializer(children, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if not Child.objects.filter(id=cid).exists():
            return Response({'error':'Child does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        child = Child.objects.get(id=cid)
        if child.parent != parent:
            return Response({'error':'Child does not belong to the parent'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ChildSerializer(child)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(operation_description="Update child for a parent",responses={200: ChildSerializer,400: "Bad Request"})
    def patch(self, request, pid, cid=None, format=None):
        '''
            View to let admin update child
        '''
        if cid is None:
            return Response({'error':'Child ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not Parent.objects.filter(pk=pid).exists():
            return Response({'error':'Parent does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        parent = Parent.objects.get(pk=pid)
        if not Child.objects.filter(pk=cid).exists():
            return Response({'error':'Child does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        child = Child.objects.get(pk=cid)
        if child.parent != parent:
            return Response({'error':'Child does not belong to the parent'}, status=status.HTTP_400_BAD_REQUEST)
        og_school = child.school
        og_classroom = child.classroom
        og_parent = child.parent
        serializer = ChildSerializer(child, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            new_child = serializer.save()
            parent_to_remove = og_parent
            if og_school != new_child.school or og_parent != new_child.parent:
                parent_groups = ParentGroup.objects.filter(school=og_school)
                for group in parent_groups:
                    if parent_to_remove in group.parent.all():
                        group.parent.remove(parent_to_remove)
                        group.save()
            if og_classroom != new_child.classroom or og_parent != new_child.parent:
                parent_groups = ParentGroup.objects.filter(school=og_school,classroom=og_classroom)
                for group in parent_groups:
                    if parent_to_remove in group.parent.all():
                        group.parent.remove(parent_to_remove)
                        group.save()
            return Response({'msg':'Child Updated Successfully', 'child': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete child for a parent",responses={200: "OK",400: "Bad Request"})
    def delete(self, request, pid, cid=None, format=None):
        '''
            View to let admin delete child
        '''
        if cid is None:
            return Response({'error':'Child ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not Parent.objects.filter(pk=pid).exists():
            return Response({'error':'Parent does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        parent = Parent.objects.get(pk=pid)
        if not Child.objects.filter(pk=cid).exists():
            return Response({'error':'Child does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        child = Child.objects.get(pk=cid)
        if child.parent != parent:
            return Response({'error':'Child does not belong to the parent'}, status=status.HTTP_400_BAD_REQUEST)
        child.delete()
        return Response({'msg':'Child Deleted Successfully'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create child for a parent",responses={200: ChildSerializer,400: "Bad Request"})
    def post(self, request, pid, cid=None, format=None):
        '''
            View to let admin add child
        '''
        if not Parent.objects.filter(pk=pid).exists():
            return Response({'error':'Parent does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        request.data['parent'] = pid
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            child = serializer.save()
            return Response({'msg':'Child Added Successfully', 'child': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)