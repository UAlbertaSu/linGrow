from django.db import models


# Model for School object and Classroom Object
#School contains name, address, email, phone, school_id
#classroom contains name, class_id, school

class School(models.Model):
    '''
    School model
    '''
    name = models.CharField(max_length=100,blank=False)
    school_id = models.CharField(max_length=100,unique=True, blank=True,null=True)
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
    class_id = models.CharField(max_length=100,unique=True, blank=True, null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['class_id']
        verbose_name_plural = "classrooms"
