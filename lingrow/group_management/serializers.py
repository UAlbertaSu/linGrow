from rest_framework import serializers
from .models import ParentGroup, TeacherGroup, ResearcherGroup
from account.models import Child 

class ParentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGroup
        fields = '__all__'
    
    def validate(self,data):
        school = data.get('school')
        classroom = data.get('classroom')
        parents = data.get('parent')
        if school:
            if parents:
                for parent in parents:
                    if classroom:
                        if Child.objects.filter(school=school,classroom=classroom,parent=parent).count() == 0:
                            raise serializers.ValidationError("Parent must have a child in the group's classroom")
                    else:
                        if Child.objects.filter(school=school,parent=parent).count() == 0:
                            raise serializers.ValidationError("Parent must have a child in the group's school")
        return data

class ParentGroupEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGroup
        fields = '__all__'
        read_only_fields = ['owner','school']

    def validate(self,data):
        instance = self.instance
        school = data.get('school',instance.school)
        classroom = data.get('classroom',instance.classroom)
        parents = data.get('parent', instance.parent.all())
        if school:
            if parents:
                for parent in parents:
                    if classroom:
                        if Child.objects.filter(school=school,classroom=classroom,parent=parent).count() == 0:
                            raise serializers.ValidationError("Parent must have a child in the group's classroom")
                    else:
                        if Child.objects.filter(school=school,parent=parent).count() == 0:
                            raise serializers.ValidationError("Parent must have a child in the group's school")
        return data

class TeacherGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherGroup
        fields = '__all__'

    def validate(self, data):
        school = data.get('school')
        teachers = data.get('teacher')
        classroom = data.get('classroom')
        if school:
            if teachers:
                for teacher in teachers:
                    if teacher.school != school:
                        raise serializers.ValidationError("Teacher must have the same school as the group")
                    if classroom:
                        if classroom not in teacher.classrooms.all():
                            raise serializers.ValidationError("Teacher must be in the group's classroom")
            
        return data

class TeacherGroupEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherGroup
        fields = '__all__'
        read_only_fields = ['owner', 'school']

    def validate(self,data):
        instance = self.instance
        school = data.get('school', instance.school)
        teachers = data.get('teacher', instance.teacher.all())
        classroom = data.get('classroom', instance.classroom)
        if school:
            if teachers:
                for teacher in teachers:
                    if teacher.school != school:
                        raise serializers.ValidationError("Teacher must have the same school as the group")
                    if classroom:
                        if classroom not in teacher.classrooms.all():
                            raise serializers.ValidationError("Teacher must be in the group's classroom")
        return data

class ResearcherGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearcherGroup
        fields = '__all__'