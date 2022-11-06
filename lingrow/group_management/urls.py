from django.urls import path
from .views import ParentGroupView, TeacherGroupView, ResearcherGroupView

urlpatterns = [
    path('parentgroup/', ParentGroupView.as_view(), name='parentgroup'),
    path('parentgroup/<int:id>/', ParentGroupView.as_view(), name='parentgroup'),
    path('teachergroup/', TeacherGroupView.as_view(), name='teachergroup'),
    path('teachergroup/<int:id>/', TeacherGroupView.as_view(), name='teachergroup'),
    path('researchergroup/', ResearcherGroupView.as_view(), name='researchergroup'),
    path('researchergroup/<int:id>/', ResearcherGroupView.as_view(), name='researchergroup'),
]