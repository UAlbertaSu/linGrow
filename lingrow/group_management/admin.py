from django.contrib import admin
from .models import ParentGroup, TeacherGroup, ResearcherGroup
# Register your models here.
admin.site.register(ParentGroup)
admin.site.register(TeacherGroup)
admin.site.register(ResearcherGroup)
