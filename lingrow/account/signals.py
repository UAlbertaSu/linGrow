from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Teacher, Researcher, Child
from rest_framework import serializers
from group_management.models import TeacherGroup, ResearcherGroup, ParentGroup

@receiver(post_save, sender=Teacher)
def update_teacher_groups(sender, instance, created, **kwargs):
    if instance.classrooms:
        for classroom in instance.classrooms.all():
            teacher_group = TeacherGroup.objects.get(classroom=classroom,school=instance.school, owner__isnull=True)
            teacher_group.teacher.add(instance)
            teacher_group.save()
    if instance.school:
        teacher_group = TeacherGroup.objects.get(school=instance.school,owner__isnull=True,classroom__isnull=True)
        teacher_group.teacher.add(instance)
        teacher_group.save()

@receiver(post_save, sender=Researcher)
def update_researcher_groups(sender, instance, created, **kwargs):
    if ResearcherGroup.objects.filter(name="All Researchers",owner__isnull=True).exists():
        researcher_group = ResearcherGroup.objects.get(name="All Researchers",owner__isnull=True)
        researcher_group.researcher.add(instance)
        researcher_group.save()
    else:
        researcher_group = ResearcherGroup.objects.create(name="All Researchers")
        researcher_group.researcher.add(instance)
        researcher_group.save()

@receiver(post_save, sender=Child)
def update_child_groups(sender, instance, created, **kwargs):
    if instance.school:
        parent_group = ParentGroup.objects.get(school=instance.school,classroom__isnull=True, owner__isnull=True)
        parent_group.parent.add(instance.parent)
        parent_group.save()
    if instance.classroom:
        parent_group = ParentGroup.objects.get(school=instance.school,classroom=instance.classroom, owner__isnull=True)
        parent_group.parent.add(instance.parent)
        parent_group.save()

@receiver(post_delete, sender=Child)
def delete_child_groups(sender, instance, **kwargs):
    parent = instance.parent
    if instance.school:
        if Child.objects.filter(parent=parent,school=instance.school).count() == 1:
            parent_gorups = ParentGroup.objects.filter(school=instance.school)
            for parent_group in parent_gorups:
                if parent in parent_group.parent.all():
                    parent_group.parent.remove(parent)
                    parent_group.save()
    if instance.classroom:
        if Child.objects.filter(parent=parent,classroom=instance.classroom).count() == 1:
            parent_groups = ParentGroup.objects.filter(school=instance.school,classroom=instance.classroom)
            for parent_group in parent_groups:
                if parent in parent_group.parent.all():
                    parent_group.parent.remove(parent)
                    parent_group.save()
