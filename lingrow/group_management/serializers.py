from rest_framework import serializers
from .models import ParentGroup, TeacherGroup, ResearcherGroup
from account.models import Teacher

class ParentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGroup
        fields = '__all__'

class TeacherGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherGroup
        fields = '__all__'

class ResearcherGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearcherGroup
        fields = ('id','name','owner','resercher')