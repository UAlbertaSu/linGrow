from rest_framework import serializers
from chat.models import Chat, PrivateChat, Message, TeacherGroupChat, ParentGroupChat, ResearcherGroupChat
from group_management.serializers import TeacherGroupSerializer, ParentGroupSerializer, ResearcherGroupSerializer
from account.serializers import UserProfileSerializer

# Chat serializers 
# Includes private and group chats. 
class PrivateChatSerializer(serializers.ModelSerializer):
    '''
    Serializer to represent a private chat.
    '''
    participant1 = UserProfileSerializer(read_only=True)
    participant2 = UserProfileSerializer(read_only=True)
    class Meta:
        model = PrivateChat
        fields = '__all__'

class TeacherGroupChatSerializer(serializers.ModelSerializer):
    '''
    Serializer to represent a teacher group chat.
    '''
    group = TeacherGroupSerializer(read_only=True)
    class Meta:
        model = TeacherGroupChat
        fields = '__all__'

class ParentGroupChatSerializer(serializers.ModelSerializer):
    '''
    Serializer to represent a parent group chat.
    '''
    group = ParentGroupSerializer(read_only=True)
    class Meta:
        model = ParentGroupChat
        fields = '__all__'

class ResearcherGroupChatSerializer(serializers.ModelSerializer):
    '''
    Serializer to represent a researcher group chat.
    '''
    group = ResearcherGroupSerializer(read_only=True)
    class Meta:
        model = ResearcherGroupChat
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    '''
    serializer to represent a message.
    '''
    sender = UserProfileSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'