from django.shortcuts import render
from rest_framework.views import APIView
from account.permissions import IsParent, IsTeacher, IsResearcher
from account.models import Child, Parent, Teacher, Researcher, User
from rest_framework.response import Response
from account.serializers import ParentProfileSerializer, TeacherProfileSerializer, ResearcherProfileSerializer, UserProfileSerializer
from rest_framework import status
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class ParentSearchView(APIView):
    permission_classes = [IsAuthenticated,IsTeacher|IsResearcher|IsAdminUser]

    def get(self, request, search = None):
        user = request.user
        parents = None
        if user.is_teacher():
            teacher = Teacher.objects.get(user=user)
            if teacher.school:
                if not search:
                    child = Child.objects.filter(school=teacher.school)
                    parents = Parent.objects.filter(child__in=child)
                    serializer = ParentProfileSerializer(parents, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    all_children = Child.objects.filter(school=teacher.school)
            else:
                return Response([], status=status.HTTP_200_OK)

        if user.is_researcher() or user.is_admin():
            if not search:
                parents = Parent.objects.all()
                serializer = ParentProfileSerializer(parents, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                all_children = Child.objects.all()
        else:
            return Response("You are not authorized to view this page", status=status.HTTP_401_UNAUTHORIZED)
        children = all_children.filter(Q(first_name__icontains=search) |
                                       Q(middle_name__icontains=search) |
                                       Q(last_name__icontains=search) |
                                       Q(student_id__icontains=search) |
                                       Q(classroom__name__icontains=search) |
                                       Q(parent__user__email__icontains=search) |
                                       Q(parent__user__first_name__icontains=search) |
                                       Q(parent__user__last_name__icontains=search) |
                                       Q(parent__user__middle_name__icontains=search) |
                                       Q(parent__user__phone__icontains=search))
        parents = Parent.objects.filter(child__in=children)
        serializer = ParentProfileSerializer(parents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TeacherSearchView(APIView):
    permission_classes = [IsAuthenticated,IsResearcher|IsAdminUser]

    def get(self, request, search = None):
        user = request.user
        if user.is_researcher() or user.is_admin():
            teachers = Teacher.objects.all()
            if not search:
                serializer = TeacherProfileSerializer(teachers, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            teachers_filtered = teachers.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__middle_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__phone__icontains=search) |
                Q(school__name__icontains=search) |
                Q(school__school_id__icontains=search) |
                Q(school__address__icontains=search) |
                Q(school__email__icontains=search) |
                Q(school__phone__icontains=search) |
                Q(classrooms__name__icontains=search) |
                Q(classrooms__class_id__icontains=search)
            )
            serializer = TeacherProfileSerializer(teachers_filtered, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("You are not authorized to view this page", status=status.HTTP_401_UNAUTHORIZED)

class ResearcherSearchView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]

    def get(self,request, search=None):
        user = request.user
        if user.is_admin():
            researchers = Researcher.objects.all()
            if search:
                researchers = researchers.filter(
                    Q(user__first_name__icontains=search) |
                    Q(user__last_name__icontains=search) |
                    Q(user__middle_name__icontains=search) |
                    Q(user__email__icontains=search) |
                    Q(user__phone__icontains=search) |
                    Q(researcher_id__icontains=search) 
                )
            serializer = ResearcherProfileSerializer(researchers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("You are not authorized to view this page", status=status.HTTP_401_UNAUTHORIZED)

class UserSearchView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]

    def get(self,request,search=None):
        user = request.user
        if user.is_admin():
            users = User.objects.all()
            if search:
                users = users.filter(
                    Q(first_name__icontains=search) |
                    Q(last_name__icontains=search) |
                    Q(middle_name__icontains=search) |
                    Q(email__icontains=search) |
                    Q(phone__icontains=search) 
                )
            serializer = UserProfileSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("You are not authorized to view this page", status=status.HTTP_401_UNAUTHORIZED)
