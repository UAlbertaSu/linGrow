from rest_framework import serializers
from .models import ParentGroup, TeacherGroup, ResearcherGroup
from account.models import Teacher, Child, Teacher, Parent, Researcher
from admin_school_management.models import School, Classroom

class ParentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGroup
        fields = '__all__'

    # def validate(self, data):
    #     return validate_parent_group(data)

class ParentGroupEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGroup
        fields = '__all__'
        read_only_fields = ['owner','school','classroom']

    # def validate(self, data):
    #     return validate_parent_group(data)

class TeacherGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherGroup
        fields = '__all__'

    # def validate(self, data):
    #     return validate_teacher_group(data)

class TeacherGroupEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherGroup
        fields = '__all__'
        read_only_fields = ['owner', 'school', 'classroom']

    # def validate(self, data):
    #     return validate_teacher_group(data)

class ResearcherGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearcherGroup
        fields = '__all__'


# def validate_parent_group(data):
#     school = data.get('school')
#     classroom = data.get('classroom')
#     if data.get('owner'):
#         user = data.get('owner')
#         if user.is_teacher():   
#             teacher = Teacher.objects.get(user=user)
#             if school:
#                 if teacher.school != school:
#                     raise serializers.ValidationError("Teacher does not belong to this school")                 
#             if classroom:
#                 if classroom not in teacher.classroom.all():
#                     raise serializers.ValidationError("Teacher does not belong to this classroom")
#     parents = data.get('parent')
#     if school or classroom:
#         for parent in parents:
#             if school and classroom:
#                 if not Child.objects.filter(parent=parent, classroom=classroom, school=school).exists():
#                     raise serializers.ValidationError(f"Parent with id {parent} does not belong to this classroom and school")
#             elif school:
#                 if not Child.objects.filter(parent=parent, school=school).exists():
#                     raise serializers.ValidationError(f"Parent with id {parent} does not belong to this school")
#             elif classroom:
#                 if not Child.objects.filter(parent=parent, classroom=classroom).exists():
#                     raise serializers.ValidationError(f"Parent wiothj id {parent} does not belong to this classroom")
#     return data

# def validate_teacher_group(data):
#     school = data.get('school')
#     classroom = data.get('classroom')
#     teachers = data.get('teacher')
#     if school or classroom:
#         for teacher in teachers:
#             if school and classroom:
#                 if not Teacher.objects.filter(id=teacher, classrooms__in=[classroom], school=school).exists():
#                     raise serializers.ValidationError(f"Teacher with id {teacher} does not belong to this classroom and school")
#             elif school:
#                 if not Teacher.objects.filter(id=teacher, school=school).exists():
#                     raise serializers.ValidationError(f"Teacher with id {teacher} does not belong to this school")
#             elif classroom:
#                 if not Teacher.objects.filter(id=teacher, classrooms__in=[classroom]).exists():
#                     raise serializers.ValidationError(f"Teacher with id {teacher} does not belong to this classroom")
#     return data