from rest_framework import permissions
from .enums import UserType

class IsParent(permissions.BasePermission):
    """
    Allows access only to parents.
    """

    def has_permission(self, request, view):
        return request.user.user_type == UserType.PARENT.value