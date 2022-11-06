from django.db import models
from account.models import Teacher, Parent, User
from admin_school_management.models import School, Classroom

# Create your models here.
class Group(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100, blank=False)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, null=True, blank=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        abstract = True

class TeacherGroup(Group):
    teacher = models.ManyToManyField(Teacher, related_name='teacher_group')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "teacher groups"

class ParentGroup(Group):
    parent = models.ManyToManyField(Parent, related_name='parent_group')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "parent groups"

class ResearcherGroup(Group):
    researcher = models.ManyToManyField(Teacher, related_name='researcher_group')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "researcher groups"