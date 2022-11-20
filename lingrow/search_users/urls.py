from django.urls import path, include
from .views import ParentSearchView, TeacherSearchView, ResearcherSearchView, UserSearchView

urlpatterns = [
    path('parents/', ParentSearchView.as_view(), name='parents'),
    path('parents/<str:search>/', ParentSearchView.as_view(), name='parent-search'),
    path('teachers/', TeacherSearchView.as_view(), name='teachers'),
    path('teachers/<str:search>/', TeacherSearchView.as_view(), name='teacher-search'),
    path('researchers/', ResearcherSearchView.as_view(), name='researchers'),
    path('researchers/<str:search>/', ResearcherSearchView.as_view(), name='researcher-search'),
    path('users/', UserSearchView.as_view(), name='users'),
    path('users/<str:search>/', UserSearchView.as_view(), name='user-search'),
]