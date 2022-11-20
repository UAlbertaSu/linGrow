from rest_framework import permissions
from .enums import UserType

class IsParent(permissions.BasePermission):
    """
    Allows access only to parents.
    """

    def has_permission(self, request, view):
        return request.user.user_type == UserType.PARENT.value

class IsTeacher(permissions.BasePermission):
    """
    Allows access only to teachers.
    """

    def has_permission(self, request, view):
        return request.user.user_type == UserType.TEACHER.value

class IsResearcher(permissions.BasePermission):
    """
    Allows access only to researchers.
    """

    def has_permission(self, request, view):
        return request.user.user_type == UserType.RESEARCHER.value