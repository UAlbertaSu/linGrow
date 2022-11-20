from django.db import models
from account.models import Teacher, Parent, User, Researcher, Child
from admin_school_management.models import School, Classroom
from rest_framework import serializers

# Create your models here.
class Group(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, null=True, blank=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)

    def clean_helper(self):
        if not self.school and self.classroom:
            raise serializers.ValidationError("Group must have a school if they have classrooms")
        if self.classroom:
            if self.school != self.classroom.school:
                raise serializers.ValidationError("Group's school and classroom's school must be the same")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    class Meta:
        abstract = True

class TeacherGroup(Group):
    teacher = models.ManyToManyField(Teacher, related_name='teacher_group', blank=True)

    def clean(self):
        self.clean_helper()
        return super().clean()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "teacher groups"
        app_label = 'teacher_group_management'

class ParentGroup(Group):
    parent = models.ManyToManyField(Parent, related_name='parent_group')

    def clean(self):
        self.clean_helper()
        if self.owner and self.owner.is_teacher():
            teacher = Teacher.objects.get(user=self.owner)
            if teacher.school != self.school:
                raise serializers.ValidationError("Teacher (Owner) must be in the same school as the group")
            if self.classroom and self.classroom not in teacher.classrooms.all():
                raise serializers.ValidationError("Teacher (Owner) must be in the classroom")
                
        return super().clean()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "parent groups"
        app_label = 'parent_group_management'

class ResearcherGroup(Group):
    researcher = models.ManyToManyField(Researcher, related_name='researcher_group')

    def clean(self):
        if self.classroom or self.school:
            raise serializers.ValidationError("Researcher groups can't have a classroom and school")
        return super().clean()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "researcher groups"
        app_label = 'researcher_group_management'
