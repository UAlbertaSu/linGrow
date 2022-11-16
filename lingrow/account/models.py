from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from .enums import UserType
from admin_school_management.models import School, Classroom
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from rest_framework import serializers


PHONE_NUMBER_VALIDATOR = [RegexValidator(regex=r'^[0-9]{10}$',
                                         message="Please enter a valid phone number. Digits length should be 10.")]
NAME_VALIDATOR = [RegexValidator(regex=r'^[a-zA-Z]{2,64}$',
                                 message="Please enter a valid first name. Minimum 2 and maximum 64 alphabets allowed.")]
ID_VALIDATOR = [RegexValidator(regex=r'^[a-zA-Z0-9]{4,30}$',
                               message="Please enter a valid id. Maximum 30 alphabets and digits allowed.")]

# Custom User Manager
class UserManager(BaseUserManager):

    def create_user(self, email, first_name, last_name, user_type, password=None, password2=None, middle_name=None, phone=None, **extra_fields):
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
            user_type=user_type,
            phone=phone)
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
    first_name = models.CharField(max_length=64, validators=NAME_VALIDATOR)
    middle_name = models.CharField(max_length=64, blank=True,null=True, validators=NAME_VALIDATOR)
    last_name = models.CharField(max_length=64, validators=NAME_VALIDATOR)
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES)
    phone = models.IntegerField( blank=True, null=True, unique=True, validators=PHONE_NUMBER_VALIDATOR)
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

    def is_parent(self):
        return self.user_type == UserType.PARENT.value
    
    def is_teacher(self):
        return self.user_type == UserType.TEACHER.value
    
    def is_researcher(self):
        return self.user_type == UserType.RESEARCHER.value

    def is_admin(self):
        return self.user_type == UserType.ADMIN.value

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.email

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    teacher_id = models.CharField(max_length=30,unique=True, validators=ID_VALIDATOR, blank=True, null=True)
    school = models.ForeignKey(School, null=True, blank=True, on_delete=models.SET_NULL)
    classrooms = models.ManyToManyField(Classroom, blank=True)

    def clean(self):
        if not self.school and self.classrooms.count() > 0:
            raise serializers.ValidationError("Teacher must have a school if they have classrooms")
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.email

class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    def __str__(self):
        return self.user.email

class Researcher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    researcher_id = models.CharField(max_length=30,unique=True, validators=ID_VALIDATOR, null=True, blank=True)
    def __str__(self):
        return self.user.email

class Child(models.Model):
    first_name = models.CharField(max_length=64, validators=NAME_VALIDATOR)
    middle_name = models.CharField(max_length=64, blank=True,null=True, validators=NAME_VALIDATOR)
    last_name = models.CharField(max_length=64, validators=NAME_VALIDATOR)
    student_id = models.CharField(max_length=30, unique=True, validators=ID_VALIDATOR, blank=True, null=True)
    school = models.ForeignKey(School, null=True, blank=True, on_delete=models.SET_NULL)
    classroom = models.ForeignKey(Classroom, null=True, blank=True, on_delete=models.SET_NULL)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)

    def clean(self) -> None:
        if not self.school and self.classroom:
            raise serializers.ValidationError("Classroom must have a school")
        if self.classroom:
            if self.school != self.classroom.school:
                raise serializers.ValidationError("Classroom must have the same school as the child")
        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.first_name + " " + self.last_name