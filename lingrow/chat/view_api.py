from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from account.models import User
from chat import utility_functions as chat_utility_functions
from translate.views import translate_text, detect_language 
from .models import Chat, PrivateChat, Message, TeacherGroupChat, ParentGroupChat, ResearcherGroupChat


class ChatListView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def get(self, request):
        chats = chat_utility_functions.get_user_private_chats(request)
        response = {'private_chats': chats, 'len_chats': len(chats)}
        return Response(response, status=status.HTTP_200_OK)

class GroupChatListView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def get(self, request):
        chats = chat_utility_functions.get_user_group_chats(request)
        return Response(chats, status=status.HTTP_200_OK)

class NewChatView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def get(self, request):
        addable = chat_utility_functions.get_addable_users_private_chat(request)
        addable.remove(request.user)
        return Response(addable,status=status.HTTP_200_OK)

class NewGroupChatView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def get(self, request):
        addable = chat_utility_functions.get_addable_users_private_chat(request)
        return Response(addable,status=status.HTTP_200_OK)

class CreateChatView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        other_username = request.data.get("other_username")
        other_user = User.objects.get(email=other_username)
        private_chat = PrivateChat()
        new_chat = PrivateChat.add_this(private_chat, request.user, other_user)
        messages = Message.objects.all().filter(chat=new_chat)
        response = {'messages': messages, 'id_chat': new_chat.id_chat, 'user2': other_user}
        return Response(response, status=status.HTTP_200_OK)

class PrivateChatView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self,request):
        chat_id = request.get("id_chat")
        chat = PrivateChat.objects.get(id_chat=chat_id)
        messages = Message.objects.all().filter(chat=chat)
        if chat.participant1 == request.user:
            participant = chat.participant2
        else:
            participant = chat.participant1
        response = {'messages': messages, 'id_chat': chat_id, 'user2': participant}
        return Response(response, status=status.HTTP_200_OK)


class GroupChatPageView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        chat_id = request.get("id_chat")
        if TeacherGroupChat.objects.filter(id_chat=chat_id).exists():
            chat = TeacherGroupChat.objects.get(id_chat=chat_id)
        elif ParentGroupChat.objects.filter(id_chat=chat_id).exists():
            chat = ParentGroupChat.objects.get(id_chat=chat_id)
        elif ResearcherGroupChat.objects.filter(id_chat=chat_id).exists():
            chat = ResearcherGroupChat.objects.get(id_chat=chat_id)
        else:
            chat = None
        response = group_chat(request, chat)
        return Response(response, status=status.HTTP_200_OK)

class SendMessageView(APIView): 
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        chat_id = request.get("id_chat")
        chat = Chat.objects.get(id_chat=chat_id)
        text_message = request.get("text-message-input")
        lang = detect_language(text_message)
        if lang != 'en':
            text_message = translate_text(text_message, lang,'en')
        if len(text_message) > 0:
            messaggio=Message.add_this(Message(), chat, request.user, text_message)
        return Response(status=status.HTTP_200_OK)

class ChatMessageView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(responses={200: 'OK'})
    def post(self, request):
        id_chat = request.get("id_chat")
        lang = request.get("lang")
        chat = Chat.objects.get(id_chat=id_chat)
        messaggi_query = Message.objects.all().filter(chat=chat)
        messaggi_json_array = []
        for messaggio in messaggi_query:
            message = messaggio.text
            message = translate_text(message, 'en', lang)
            msg = {'username': messaggio.sender.email, 'text': message,
                'timestamp': messaggio.timestamp.strftime('%Y-%m-%d %H:%M')}
            messaggi_json_array.append(msg)
        return Response(messaggi_json_array, status=status.HTTP_200_OK)


def group_chat(request,chat):
    messages = Message.objects.all().filter(chat=chat)
    participants = chat_utility_functions.get_group_chat_partecipants(request, chat.id_chat)
    response = {'group_chat': chat, 'messages': messages, 'participants': participants,'id_chat': chat.id_chat}
    return response

def get_message_by_id(id):
    return Message.objects.all().get(id=id)
