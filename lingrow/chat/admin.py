from django.contrib import admin
from chat import models

# Register your models here.
admin.site.register(models.Message)
admin.site.register(models.Chat)
admin.site.register(models.PrivateChat)
admin.site.register(models.TeacherGroupChat)
admin.site.register(models.ParentGroupChat)
admin.site.register(models.ResearcherGroupChat)
