from rest_framework import serializers
from chat.models import Chat, PrivateChat, Message, TeacherGroupChat, ParentGroupChat, ResearcherGroupChat
from group_management.serializers import TeacherGroupSerializer, ParentGroupSerializer, ResearcherGroupSerializer
from account.serializers import UserProfileSerializer


class PrivateChatSerializer(serializers.ModelSerializer):
    participant1 = UserProfileSerializer(read_only=True)
    participant2 = UserProfileSerializer(read_only=True)
    class Meta:
        model = PrivateChat
        fields = '__all__'

class TeacherGroupChatSerializer(serializers.ModelSerializer):
    group = TeacherGroupSerializer(read_only=True)
    class Meta:
        model = TeacherGroupChat
        fields = '__all__'

class ParentGroupChatSerializer(serializers.ModelSerializer):
    group = ParentGroupSerializer(read_only=True)
    class Meta:
        model = ParentGroupChat
        fields = '__all__'

class ResearcherGroupChatSerializer(serializers.ModelSerializer):
    group = ResearcherGroupSerializer(read_only=True)
    class Meta:
        model = ResearcherGroupChat
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = UserProfileSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'