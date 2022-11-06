from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from account.permissions import IsTeacher, IsResearcher
from .models import ParentGroup, TeacherGroup, ResearcherGroup
from drf_yasg.utils import swagger_auto_schema
from .renderers import GroupRenderer
from account.permissions import IsTeacher, IsResearcher
from account.models import Teacher
from django.db.models import Q
from .serializers import ParentGroupSerializer, TeacherGroupSerializer, ResearcherGroupSerializer
# Create your views here.


class ParentGroupView(APIView):
    renderer_classes = [GroupRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser|IsTeacher|IsResearcher]

    @swagger_auto_schema(operation_description="Get all parent groups/ Get parent group with id",responses={200: ParentGroupSerializer(many=True),400: "Bad Request", 404: "Not Found"})
    def get(self, request, id=None):
        user = request.user
        if user.is_teacher():
            teacher = Teacher.objects.get(user=user)
            if id:
                if ParentGroup.objects.filter(Q(pk=id) & (Q(owner=user) | Q(classroom__in=teacher.classrooms.all()))).exists():
                    return Response(ParentGroupSerializer(ParentGroup.objects.get(pk=id)).data, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)  
            groups = ParentGroup.objects.filter(Q(owner=user) | Q(classroom__in=teacher.classrooms.all()))
        
        elif user.is_researcher():
            if id:
                if ParentGroup.objects.filter(pk=id,owner=user).exists():
                    return Response(ParentGroupSerializer(ParentGroup.objects.get(pk=id)).data, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            groups = ParentGroup.objects.filter(owner=user)

        elif user.is_admin():
            if id:
                if ParentGroup.objects.filter(pk=id).exists():
                    return Response(ParentGroupSerializer(ParentGroup.objects.get(pk=id)).data, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            groups = ParentGroup.objects.all()

        else:
            return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(ParentGroupSerializer(groups, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create parent group",request_body=ParentGroupSerializer, responses={201: ParentGroupSerializer,400: "Bad Request"})
    def post(self, request, id=None):
        if id:
            return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        request.data['owner'] = user
        serializer = ParentGroupSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete parent group with id",request_body=ParentGroupSerializer, responses={200: "Group Deleted!",400: "Bad Request", 404: "Group does not exist"})
    def delete(self, request, id=None):
        if id:
            user = request.user
            if user.is_teacher() or user.is_researcher():
                if ParentGroup.objects.filter(pk=id,owner=user).exists():
                    ParentGroup.objects.get(pk=id).delete()
                    return Response({"message": "Group deleted!"}, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            elif user.is_admin():
                if ParentGroup.objects.filter(pk=id).exists():
                    ParentGroup.objects.get(pk=id).delete()
                    return Response({"message": "Group deleted!"}, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Update parent group with id",request_body=ParentGroupSerializer, responses={200: ParentGroupSerializer,400: "Bad Request", 404: "Group does not exist"})
    def patch(self, request, id=None):
        if id:
            user = request.user
            if user.is_teacher() or user.is_researcher():
                if ParentGroup.objects.filter(pk=id,owner=user).exists():
                    group = ParentGroup.objects.get(pk=id)
                    serializer = ParentGroupSerializer(group, data=request.data, partial=True)
                    if serializer.is_valid(raise_exception=True):
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            elif user.is_admin():
                if ParentGroup.objects.filter(pk=id).exists():
                    group = ParentGroup.objects.get(pk=id)
                    serializer = ParentGroupSerializer(group, data=request.data, partial=True)
                    if serializer.is_valid(raise_exception=True):
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

class TeacherGroupView(APIView):
    renderer_classes = [GroupRenderer]
    permission_classes = [IsAuthenticated, IsResearcher|IsAdminUser]

    @swagger_auto_schema(operation_description="Get all teacher groups/ get teacher group with id", responses={200: TeacherGroupSerializer,400: "Bad Request", 404: "Group does not exist"})
    def get(self, request, id=None):
        user = request.user
        if user.is_researcher():
            if id:
                if TeacherGroup.objects.filter(pk=id,owner=user).exists():
                    return Response(TeacherGroupSerializer(TeacherGroup.objects.get(pk=id)).data, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            groups = TeacherGroup.objects.filter(owner=user)
        
        elif user.is_admin():
            if id:
                if TeacherGroup.objects.filter(pk=id).exists():
                    return Response(TeacherGroupSerializer(TeacherGroup.objects.get(pk=id)).data, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            groups = TeacherGroup.objects.all()

        else:
            return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TeacherGroupSerializer(groups, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create teacher group",request_body=TeacherGroupSerializer, responses={201: TeacherGroupSerializer,400: "Bad Request"})
    def post(self, request, id=None):
        if id:
            return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        request.data['owner'] = user
        serializer = TeacherGroupSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete teacher group with id",request_body=TeacherGroupSerializer, responses={200: "Group Deleted!",400: "Bad Request", 404: "Group does not exist"})
    def delete(self, request, id=None):
        if id:
            user = request.user
            if user.is_researcher():
                if TeacherGroup.objects.filter(pk=id,owner=user).exists():
                    TeacherGroup.objects.get(pk=id).delete()
                    return Response({"message": "Group deleted!"}, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            elif user.is_admin():
                if TeacherGroup.objects.filter(pk=id).exists():
                    TeacherGroup.objects.get(pk=id).delete()
                    return Response({"message": "Group deleted!"}, status=status.HTTP_200_OK)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Update teacher group with id",request_body=TeacherGroupSerializer, responses={200: TeacherGroupSerializer,400: "Bad Request", 404: "Group does not exist"})
    def patch(self, request, id=None):
        if id:
            user = request.user
            if user.is_researcher():
                if TeacherGroup.objects.filter(pk=id,owner=user).exists():
                    group = TeacherGroup.objects.get(pk=id)
                    serializer = TeacherGroupSerializer(group, data=request.data, partial=True)
                    if serializer.is_valid(raise_exception=True):
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            elif user.is_admin():
                if TeacherGroup.objects.filter(pk=id).exists():
                    group = TeacherGroup.objects.get(pk=id)
                    serializer = TeacherGroupSerializer(group, data=request.data, partial=True)
                    if serializer.is_valid(raise_exception=True):
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

class ResearcherGroupView(APIView):
    renderer_classes = [GroupRenderer]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @swagger_auto_schema(operation_description="Get all researcher groups/ get researcher group with id", responses={200: ResearcherGroupSerializer,400: "Bad Request", 404: "Group does not exist"})
    def get(self, request, id=None):
        if id:
            if ResearcherGroup.objects.filter(pk=id).exists():
                return Response(ResearcherGroupSerializer(ResearcherGroup.objects.get(pk=id)).data, status=status.HTTP_200_OK)
            return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
        groups = ResearcherGroup.objects.all()
        return Response(ResearcherGroupSerializer(groups, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create researcher group",request_body=ResearcherGroupSerializer, responses={201: ResearcherGroupSerializer,400: "Bad Request"})
    def post(self, request, id=None):
        if id:
            return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
        request.data['owner'] = request.user
        serializer = ResearcherGroupSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete researcher group with id",request_body=ResearcherGroupSerializer, responses={200: "Group Deleted!",400: "Bad Request", 404: "Group does not exist"})
    def delete(self, request, id=None):
        if id:
            if ResearcherGroup.objects.filter(pk=id).exists():
                ResearcherGroup.objects.get(pk=id).delete()
                return Response({"message": "Group deleted!"}, status=status.HTTP_200_OK)
            return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Update researcher group with id",request_body=ResearcherGroupSerializer, responses={200: ResearcherGroupSerializer,400: "Bad Request", 404: "Group does not exist"})
    def patch(self, request, id=None):
        if id:
            if ResearcherGroup.objects.filter(pk=id).exists():
                group = ResearcherGroup.objects.get(pk=id)
                serializer = ResearcherGroupSerializer(group, data=request.data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)