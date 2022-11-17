from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from translate import views


schema_view = get_schema_view(
    openapi.Info(
        title="Lingrow API",
        default_version='v1',
        description="Lingrow API",
        terms_of_service="https://www.google.com/policies/terms/",
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('account.urls')),
    path('api/school/', include('admin_school_management.urls')),
    path('api/translate/', views.TranslationView.as_view()),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('', include('chat.urls')),
    path('api/group/', include('group_management.urls')),
]
