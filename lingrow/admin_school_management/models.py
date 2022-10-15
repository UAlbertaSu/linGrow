from tabnanny import verbose
from tkinter.font import names
from django.db import models


class Classroom(models.Model):
    name = models.CharField(max_length=100,blank=False)
    classid = models.IntegerField(blank=True)

    def __str__(self):
        return self.name


    class Meta:
        ordering = ['classid']
        verbose_name_plural = "classrooms"

class School(models.Model):
    name = models.CharField(max_length=100,blank=False)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='Classroom',blank=True)
    schoolid = models.IntegerField()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['schoolid']
        verbose_name_plural = "schools"
# Create your models here.
