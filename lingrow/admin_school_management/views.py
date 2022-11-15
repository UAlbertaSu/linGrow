from rest_framework import status
from .renderers import SchoolRenderer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from admin_school_management.models import Classroom, School
from admin_school_management.serializers import SchoolRegistrationSerializer, \
     SchoolDetailSerializer, ClassroomRegistrationSerializer, ClassroomDetailSerializer
from drf_yasg.utils import swagger_auto_schema
from group_management.models import ParentGroup, TeacherGroup, ResearcherGroup


class SchoolRegistrationView(APIView):
    '''
    View to register a school
    '''
    renderer_classes = [SchoolRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @swagger_auto_schema(operation_description="Add a new School",responses={201: SchoolDetailSerializer,400: "Bad Request"})
    def post(self,request):
        '''
        Post method to register a school
        '''
        serializer = SchoolRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            school = serializer.save()
            teacher_group = TeacherGroup.objects.create(name=f"{school.name}-Teachers", school=school)
            parent_group = ParentGroup.objects.create(name=f"{school.name}-Parents", school=school)
            teacher_group.save()
            parent_group.save()
            return Response({"message": "School added!" ,"school": SchoolDetailSerializer(school).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="View all Schools",responses={200: SchoolDetailSerializer,400: "Bad Request"})
    def get(self,request):
        '''
        Get method to list all schools
        '''
        schools = School.objects.all()
        serializer = SchoolDetailSerializer(schools, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SchoolUpdateView(APIView):
    '''
    View to update a school
    '''
    renderer_classes = [SchoolRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @swagger_auto_schema(operation_description="Get a school with id",responses={200: SchoolDetailSerializer,404: "Not Found"})
    def get(self, request,pk):
        '''
        Get method to get a school with id
        '''
        if not School.objects.filter(pk=pk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(pk)}, status=status.HTTP_404_NOT_FOUND)
        serializer = SchoolDetailSerializer(School.objects.get(pk=pk))
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Delete a school with id",responses={200: "OK",404: "Not Found"})
    def delete(self,request, pk):
        '''
        Delete method to delete a school with id
        '''
        if not School.objects.filter(pk=pk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(pk)}, status=status.HTTP_404_NOT_FOUND)
        School.objects.get(pk=pk).delete()
        return Response({'message': 'School with id {} deleted successfully'.format(pk)}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Update a school with id",responses={200: SchoolDetailSerializer,404: "Not Found"})
    def patch(self,request, pk):
        '''
        Patch method to update a school with id
        '''
        if not School.objects.filter(pk=pk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(pk)}, status=status.HTTP_404_NOT_FOUND)
        school = School.objects.get(pk=pk)
        serializer = SchoolDetailSerializer(school, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            school = serializer.save()
            teacher_group = TeacherGroup.objects.get(school=school,owner=None)
            if teacher_group.name != f"{school.name}-Teachers":
                teacher_group.name = f"{school.name}-Teachers"
                teacher_group.save()
            parent_group = ParentGroup.objects.get(school=school,owner=None)
            if parent_group.name != f"{school.name}-Parents":
                parent_group.name = f"{school.name}-Parents"
                parent_group.save()
            return Response(SchoolDetailSerializer(school).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClassroomRegistrationView(APIView):
    '''
    View to register a classroom
    '''
    renderer_classes = [SchoolRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @swagger_auto_schema(operation_description="Add a new Classroom",responses={201: ClassroomDetailSerializer,400: "Bad Request"})
    def post(self,request,pk):
        '''
        Post method to register a classroom
        '''
        if not School.objects.filter(pk=pk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(pk)}, status=status.HTTP_404_NOT_FOUND)
        request.data['school'] = pk
        serializer = ClassroomRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            classroom = serializer.save()
            teacher_group = TeacherGroup.objects.create(name=f"{classroom.name}-Teachers", school=classroom.school, classroom=classroom)
            parent_group = ParentGroup.objects.create(name=f"{classroom.name}-Parents", school=classroom.school, classroom=classroom)
            teacher_group.save()
            parent_group.save()
            return Response({"message": "Classroom added!" ,"classroom": ClassroomDetailSerializer(classroom).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Get all classrooms in a school",responses={200: ClassroomDetailSerializer,400: "Bad Request"})    
    def get(self,request,pk):
        '''
        Get method to list all classrooms in a school
        '''
        if not School.objects.filter(pk=pk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(pk)}, status=status.HTTP_404_NOT_FOUND)
        school = School.objects.get(pk=pk)
        classrooms = Classroom.objects.filter(school=school)
        serializer = ClassroomDetailSerializer(classrooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClassroomUpdateView(APIView):
    '''
    View to update a classroom
    '''
    renderer_classes = [SchoolRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @swagger_auto_schema(operation_description="Get a classroom with id",responses={200: ClassroomDetailSerializer,404: "Not Found"})
    def get(self,request,sk,ck):
        '''
        Get method to get a classroom with id
        '''
        if not School.objects.filter(pk=sk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(sk)}, status=status.HTTP_404_NOT_FOUND)
        school = School.objects.get(pk=sk)
        if not Classroom.objects.filter(pk=ck,school=school).exists():
            return Response({'errors': 'Classroom with id {} does not exist'.format(ck)}, status=status.HTTP_404_NOT_FOUND)
        classroom = Classroom.objects.get(pk=ck,school=school)
        serializer = ClassroomDetailSerializer(classroom)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Delete a classroom with id",responses={200: "OK",404: "Not Found"})
    def delete(self, request,sk,ck):
        '''
        Delete method to delete a classroom with id
        '''
        if not School.objects.filter(pk=sk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(sk)}, status=status.HTTP_404_NOT_FOUND)
        school = School.objects.get(pk=sk)
        if not Classroom.objects.filter(pk=ck,school=school).exists():
            return Response({'errors': 'Classroom with id {} does not exist'.format(ck)}, status=status.HTTP_404_NOT_FOUND)
        Classroom.objects.get(pk=ck,school=school).delete()
        return Response({'message': 'Classroom with id {} deleted successfully'.format(ck)}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Update a classroom with id",responses={200: ClassroomDetailSerializer,404: "Not Found"})
    def patch(self,request,sk,ck):
        '''
        Patch method to update a classroom with id
        '''
        if not School.objects.filter(pk=sk).exists():
            return Response({'errors': 'School with id {} does not exist'.format(sk)}, status=status.HTTP_404_NOT_FOUND)
        school = School.objects.get(pk=sk)
        if not Classroom.objects.filter(pk=ck,school=school).exists():
            return Response({'errors': 'Classroom with id {} does not exist'.format(ck)}, status=status.HTTP_404_NOT_FOUND)
        classroom = Classroom.objects.get(pk=ck,school=school)
        serializer = ClassroomDetailSerializer(classroom, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            classroom = serializer.save()
            teacher_group = TeacherGroup.objects.get(school=school,classroom=classroom,owner=None)
            parent_group = ParentGroup.objects.get(school=school,classroom=classroom,owner=None)
            if teacher_group.name != f"{classroom.name}-Teachers":
                teacher_group.name = f"{classroom.name}-Teachers"
                teacher_group.save()
            if parent_group.name != f"{classroom.name}-Parents":
                parent_group.name = f"{classroom.name}-Parents"
                parent_group.save()
            return Response(ClassroomDetailSerializer(classroom).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)