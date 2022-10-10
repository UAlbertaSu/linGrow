from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from admin_school_management import views

urlpatterns = [
    path('schools/', views.school_list),
    path('schools/<int:pk>/', views.school_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)