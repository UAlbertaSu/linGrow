from django.contrib import admin
from account.models import User, Admin, Teacher, Parent, Researcher
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserModelAdmin
    # that reference specific fields on auth.User.
    list_display = ('id', 'email', 'first_name', 'last_name', 'user_type')
    list_filter = ('user_type',)
    fieldsets = (
        ('User Credentials', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'middle_name', 'last_name')}),
        ('Permissions', {'fields': ('user_type',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name','middle_name','last_name','user_type', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email', 'id')
    filter_horizontal = ()

# Now register the new UserAdmin...
admin.site.register(User, UserModelAdmin)
admin.site.register(Admin)
admin.site.register(Teacher)
admin.site.register(Parent)
admin.site.register(Researcher)