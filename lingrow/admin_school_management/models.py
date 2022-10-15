from django.db import models
from account.models import Teacher, Parent


class School(models.Model):
    '''
    School model
    '''
    name = models.CharField(max_length=100,blank=False)
    school_id = models.CharField(max_length=100,unique=True, blank=False)
    teachers = models.ManyToManyField(Teacher)
    address = models.TextField(blank=True)
    email = models.EmailField(blank=False, unique=True)
    phone = models.IntegerField(blank=True, null=True,unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['school_id']
        verbose_name_plural = "schools"

class Classroom(models.Model):
    '''
    Classroom model
    '''
    name = models.CharField(max_length=100,blank=False)
    class_id = models.CharField(max_length=100,unique=True, blank=False)
    school = models.OneToOneField(School, on_delete=models.CASCADE)
    teachers = models.ManyToManyField(Teacher)
    parents = models.ManyToManyField(Parent)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['class_id']
        verbose_name_plural = "classrooms"
