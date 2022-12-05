from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from account.models import User
from chat import utility_functions as chat_utility_functions
from translate.views import translate_text, detect_language 
from .models import Chat, PrivateChat, Message, TeacherGroupChat, ParentGroupChat, ResearcherGroupChat
from .serializers import PrivateChatSerializer, TeacherGroupChatSerializer, ParentGroupChatSerializer, ResearcherGroupChatSerializer, MessageSerializer
from account.serializers import UserProfileSerializer, ParentProfileSerializer, TeacherProfileSerializer, ResearcherProfileSerializer
from django.db.models import Q
from account.enums import UserType

# Chat API views 

class ChatListView(APIView):
    '''
    View to list all chats for a user.
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def get(self, request):
        chats = chat_utility_functions.get_user_private_chats(request)
        serializer = PrivateChatSerializer(chats, many=True)
        user = request.user
        for chat in serializer.data:
            if chat['participant1']['id'] == user.id:
                chat['participant'] = chat['participant2']
            else:
                chat['participant'] = chat['participant1']
            del chat['participant1']
            del chat['participant2']
        response = {'private_chats': serializer.data, 'len_chats': len(chats)}
        return Response(response, status=status.HTTP_200_OK)

class GroupChatListView(APIView):
    '''
    View to list all group chats for a user.
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def get(self, request):
        parent_chats, teacher_chats, researcher_chats = chat_utility_functions.get_user_group_chats(request)
        parent_searilizer = ParentGroupChatSerializer(parent_chats, many=True)
        teacher_searilizer = TeacherGroupChatSerializer(teacher_chats, many=True)
        researcher_searilizer = ResearcherGroupChatSerializer(researcher_chats, many=True)
        final_data = parent_searilizer.data + teacher_searilizer.data + researcher_searilizer.data
        response = {"group_chats": final_data, "len_chats": len(final_data)}
        return Response(response, status=status.HTTP_200_OK)

class NewChatView(APIView):
    '''
    View to retrieve new chats for a user.
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def get(self, request):
        current_user = request.user
        addable = chat_utility_functions.get_addable_users_private_chat(request)
        addable_users = []
        for user in addable:
            if not PrivateChat.objects.filter(Q(participant1=current_user, participant2=user) | Q(participant1=user, participant2=current_user)).exists():
                addable_users.append(user)
        serializer = UserProfileSerializer(addable_users, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class CreateChatView(APIView):
    '''
    view to create a new chat.
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        other_username = request.data.get("other_username")
        other_user = User.objects.get(email=other_username)
        if PrivateChat.objects.filter(Q(participant1=request.user, participant2=other_user) | Q(participant1=other_user, participant2=request.user)).exists():
            return Response({"error": "Chat with user already exists!"},status=status.HTTP_400_BAD_REQUEST)
        private_chat = PrivateChat()
        new_chat = PrivateChat.add_this(private_chat, request.user, other_user)
        messages = Message.objects.all().filter(chat=new_chat)
        serializer = UserProfileSerializer(other_user)
        message_serializer = MessageSerializer(messages, many=True)
        response = {'messages': message_serializer.data, 'id_chat': new_chat.id_chat, 'user2': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

class PrivateChatView(APIView):
    
    '''
    View to generate private chat between 2 users.
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self,request):
        chat_id = request.data.get("id_chat")
        chat = PrivateChat.objects.get(id_chat=chat_id)
        messages = Message.objects.all().filter(chat=chat)
        if chat.participant1 == request.user:
            participant = chat.participant2
        else:
            participant = chat.participant1
        serializer = UserProfileSerializer(participant)
        message_serializer = MessageSerializer(messages, many=True)
        response = {'messages': message_serializer.data, 'id_chat': chat_id, 'user2': serializer.data}
        return Response(response, status=status.HTTP_200_OK)


class GroupChatPageView(APIView):
    '''
    View to generate a group chat
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        chat_id = request.data.get("id_chat")
        if TeacherGroupChat.objects.filter(id_chat=chat_id).exists():
            chat = TeacherGroupChat.objects.get(id_chat=chat_id)
            serializer = TeacherGroupChatSerializer(chat)
        elif ParentGroupChat.objects.filter(id_chat=chat_id).exists():
            chat = ParentGroupChat.objects.get(id_chat=chat_id)
            serializer = ParentGroupChatSerializer(chat)
        elif ResearcherGroupChat.objects.filter(id_chat=chat_id).exists():
            chat = ResearcherGroupChat.objects.get(id_chat=chat_id)
            serializer = ResearcherGroupChatSerializer(chat)
        else:
            chat = None
        response = group_chat(request, chat)
        response['group_chat'] = serializer.data
        return Response(response, status=status.HTTP_200_OK)

class SendMessageView(APIView): 
    '''
    View that sends a message to a chat.
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        chat_id = request.data.get("id_chat")
        chat = Chat.objects.get(id_chat=chat_id)
        text_message = request.data.get("message")
        # lang = detect_language(text_message)
        # print(lang)
        # if lang != 'en':
        #     text_message = translate_text(text_message, lang,'en')
        response = {}
        if len(text_message) > 0:
            messaggio=Message.add_this(Message(), chat, request.user, text_message)
            response = {'message': MessageSerializer(messaggio).data}
        return Response(response,status=status.HTTP_200_OK)

class ChatMessageView(APIView):
    '''
    view to retrieve messages for a chat.
    '''
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        id_chat = request.data.get("id_chat")
        lang = request.data.get("lang")
        chat = Chat.objects.get(id_chat=id_chat)
        messaggi_query = Message.objects.all().filter(chat=chat)
        messaggi_json_array = []
        for messaggio in messaggi_query:
            message = messaggio.text
            message = translate_text(message, detect_language(message), lang)
            msg = {'username': messaggio.sender.email, 'text': message,
                'timestamp': messaggio.timestamp.strftime('%Y-%m-%d %H:%M')}
            messaggi_json_array.append(msg)
        return Response(messaggi_json_array, status=status.HTTP_200_OK)


def group_chat(request,chat):
    '''
    view to generate a group chat.
    '''
    messages = Message.objects.all().filter(chat=chat)
    message_serializer = MessageSerializer(messages, many=True)
    participants, user_type  = chat_utility_functions.get_group_chat_partecipants(request, chat.id_chat)
    if user_type == UserType.PARENT.value:
        serializer = ParentProfileSerializer(participants, many=True)
    elif user_type == UserType.TEACHER.value:
        serializer = TeacherProfileSerializer(participants, many=True)
    elif user_type == UserType.RESEARCHER.value:
        serializer = ResearcherProfileSerializer(participants, many=True)
    response = {'messages': message_serializer.data, 'participants': serializer.data,'id_chat': chat.id_chat}
    return response

def get_message_by_id(id):
    '''
    view to filter a specific message
    '''
    return Message.objects.all().get(id=id)
