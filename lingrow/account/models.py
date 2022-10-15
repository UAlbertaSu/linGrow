from email.policy import default
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from .enums import UserType

# Custom User Manager
class UserManager(BaseUserManager):

    def create_user(self, email, first_name, last_name, user_type, password=None, password2=None, middle_name=None, **extra_fields):
        """
        Creates and saves a user with the given email, first_name, last_name, user_type and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            middle_name=middle_name,
            user_type=user_type,)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email, name, tc and password.
        """
        new_user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            user_type=4,
            password=password,
        )
        new_user.is_admin = True
        new_user.is_staff = True
        new_user.save(using=self._db)
        admin = Admin(user=new_user)
        admin.save()
        return new_user

#Custom User model
class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )
    USER_TYPE_CHOICES = (
      (UserType.PARENT.value, 'parent'),
      (UserType.TEACHER.value, 'teacher'),
      (UserType.RESEARCHER.value, 'researcher'),
      (UserType.ADMIN.value, 'admin')
    )
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True,null=True)
    last_name = models.CharField(max_length=255)
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name','user_type']

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.user_type == UserType.ADMIN.value

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return self.user_type == UserType.ADMIN.value

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.user_type == UserType.ADMIN.value

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.email

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    # teacher_id = models.IntegerField()
    # teacher_name = models.CharField(max_length=255)
    # teacher_surname = models.CharField(max_length=255)
    # teacher_tc = models.CharField(max_length=255)
    # teacher_email = models.CharField(max_length=255)
    # teacher_password = models.CharField(max_length=255)
    # teacher_phone = models.CharField(max_length=255)
    def __str__(self):
        return self.user.email

class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    child_name = models.CharField(max_length=255)
    # parent_id = models.IntegerField()
    # parent_name = models.CharField(max_length=255)
    # parent_surname = models.CharField(max_length=255)
    # parent_tc = models.CharField(max_length=255)
    # parent_email = models.CharField(max_length=255)
    # parent_password = models.CharField(max_length=255)
    # parent_phone = models.CharField(max_length=255)
    def __str__(self):
        return self.user.email

class Researcher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    # researcher_id = models.IntegerField()
    # researcher_name = models.CharField(max_length=255)
    # researcher_surname = models.CharField(max_length=255)
    # researcher_tc = models.CharField(max_length=255)
    # researcher_email = models.CharField(max_length=255)
    # researcher_password = models.CharField(max_length=255)
    # researcher_phone = models.CharField(max_length=255)
    def __str__(self):
        return self.user.email

# class Child(models.Model):
#     student_id = models.IntegerField()
#     first_name = models.CharField(max_length=255)
#     middle_name = models.CharField(max_length=255)
#     last_name = models.CharField(max_length=255)