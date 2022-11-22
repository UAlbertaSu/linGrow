from rest_framework import serializers
from admin_school_management.models import School, Classroom
from account.models import Teacher, Parent


class SchoolDetailSerializer(serializers.ModelSerializer):
    '''
    Serializer to get school details
    '''
    class Meta:
        model = School
        fields = '__all__'


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
    address = serializers.CharField(required=False)
    phone = serializers.IntegerField(required=False)
    school_id = serializers.CharField(required=False)
    class Meta:
        model = School
        fields = ['name', 'school_id', 'address', 'email', 'phone']

        def create(self, validated_data):
            '''
            Create school
            '''
            school = School.objects.create(**validated_data)
            return school


class ClassroomDetailSerializer(serializers.ModelSerializer):
    '''
    Serializer to get classroom details
    '''
    school = SchoolMinDetailSerializer()
    class Meta:
        model = Classroom
        fields = '__all__'
        read_only_fields = ['school']


class ClassroomRegistrationSerializer(serializers.ModelSerializer):
    '''
    Serializer to register classroom
    '''
    class_id = serializers.CharField(required=False)
    class Meta:
        model = Classroom
        fields = ['name', 'class_id', 'school']

        def create(self, validated_data):
            '''
            Create classroom
            '''
            classroom = Classroom.objects.create(**validated_data)
            return classroom