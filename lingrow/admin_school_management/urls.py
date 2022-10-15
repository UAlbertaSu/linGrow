from django.urls import path
from .views import SchoolRegistrationView, SchoolUpdateView, \
                    ClassroomRegistrationView, ClassroomUpdateView

'''
URL patterns for admin_school_management app
'''
urlpatterns = [
    path('', SchoolRegistrationView.as_view(), name='school-registration'),
    path('<int:pk>/', SchoolUpdateView.as_view(), name='school-detail'),
    path('<int:pk>/classroom/', ClassroomRegistrationView.as_view(), name='classroom-registration'),
    path('<int:sk>/classroom/<int:ck>/', ClassroomUpdateView.as_view() , name='classroom-detail'),
]
