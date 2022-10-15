from rest_framework import serializers
from admin_school_management.models import School, Classroom
from account.models import Teacher, Parent


class SchoolDetailSerializer(serializers.ModelSerializer):
    '''
    Serializer to get school details
    '''
    teacher_ids = serializers.ListField(required=False)
    class Meta:
        model = School
        fields = '__all__'

        def validate(self, data):
            '''
            Validate teacher_ids
            '''
            if data.get('teacher_ids'):
                teachers = Teacher.objects.filter(user__id__in=data.get('teacher_ids'))
                if len(teachers) != len(data.get('teacher_ids')):
                    raise serializers.ValidationError('Invalid teacher ids')
                data['teachers'] = teachers
            return data
        
        def update(self, instance, validated_data):
            '''
            Update school details
            '''
            if validated_data.get('teachers'):
                instance.teachers.add(*validated_data.get('teachers'))
                validated_data.pop('teachers')
            return super().update(instance, validated_data)


class SchoolMinDetailSerializer(serializers.ModelSerializer):
    '''
    Serializer to get school details
    '''
    class Meta:
        model = School
        fields = ['id', 'name', 'school_id', 'address', 'email']


class SchoolRegistrationSerializer(serializers.ModelSerializer):
    '''
    Serializer to register school
    '''
    teacher_ids = serializers.ListField(required=False)
    address = serializers.CharField(required=False)
    phone = serializers.IntegerField(required=False)
    class Meta:
        model = School
        fields = ['name', 'school_id','teacher_ids', 'address', 'email', 'phone']

        def validate(self, data):
            '''
            Validate teacher_ids
            '''
            if data.get('teacher_ids'):
                teachers = Teacher.objects.filter(user__id__in=data.get('teacher_ids'))
                if len(teachers) != len(data.get('teacher_ids')):
                    raise serializers.ValidationError('Invalid teacher ids')
                data['teachers'] = teachers
            return data

        def create(self, validated_data):
            '''
            Create school
            '''
            school = School.objects.create(**validated_data)
            if validated_data.get('teachers'):
                school.teachers.add(*validated_data.get('teachers'))
            return school


class ClassroomDetailSerializer(serializers.ModelSerializer):
    '''
    Serializer to get classroom details
    '''
    school = SchoolMinDetailSerializer()
    class Meta:
        model = Classroom
        fields = '__all__'


class ClassroomRegistrationSerializer(serializers.ModelSerializer):
    '''
    Serializer to register classroom
    '''
    teachers_id = serializers.ListField(required=False)
    parents_id = serializers.ListField(required=False)
    class Meta:
        model = Classroom
        fields = ['name', 'class_id', 'school', 'teachers_id', 'parents_id']

        def validate(self,data):
            '''
            Validate teachers_id and parents_id
            '''
            if data.get('teachers_id'):
                teachers = Teacher.objects.filter(user__id__in=data.get('teachers_id'))
                if len(teachers) != len(data.get('teachers_id')):
                    raise serializers.ValidationError('Invalid teacher ids')
                data['teachers'] = teachers
            if data.get('parents_id'):
                parents = Parent.objects.filter(id__in=data.get('parents_id'))
                if len(parents) != len(data.get('parents_id')):
                    raise serializers.ValidationError('Invalid parent ids')
                data['parents'] = parents
            return data

        def create(self, validated_data):
            '''
            Create classroom
            '''
            teachers = validated_data.pop('teachers', [])
            parents = validated_data.pop('parents', [])
            classroom = Classroom.objects.create(**validated_data)
            classroom.teachers.set(teachers)
            classroom.parents.set(parents)
            return classroom

        def update(self, instance, validated_data):
            '''
            Update classroom
            '''
            teachers = validated_data.pop('teachers', [])
            parents = validated_data.pop('parents', [])
            instance.teachers.set(teachers)
            instance.parents.set(parents)
            return super().update(instance, validated_data)