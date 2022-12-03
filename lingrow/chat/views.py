from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from chat import utility_functions as chat_utility_functions
from account.models import User
from chat.models import Chat, PrivateChat, Message, TeacherGroupChat, ParentGroupChat, ResearcherGroupChat
from django.http import HttpResponse
from django.http import JsonResponse
from django import forms
from translate.views import translate_text, detect_language

LANGUAGE_CHOICES = {
    'English': 'en',
    'Français': 'fr',
    'हिन्दी': 'hi'
}


# returns the list of private chats of the current user
@login_required()
def chat_list(request):
    chat_list = chat_utility_functions.get_user_private_chats(request)
    return render(request, 'private-chat-list.html',
                  {'private_chats': chat_list, 'len_chats': len(chat_list)})

#returns the current user's group chat list
@login_required()
def group_list(request):
    group_list = chat_utility_functions.get_user_group_chats(request)
    return render(request, 'group-chat-list.html', {'group_chats': group_list, 'len_chats': len(group_list)})

#takes us to the page to create (or continue) a private chat, generates the list of users I can chat with
@login_required()
def new_chat(request):
    addable = chat_utility_functions.get_addable_users_private_chat(request)
    addable.remove(request.user)
    return render(request, 'new-chat.html', {'users': addable, 'len_addable': len(addable)})

# It takes us to the page to create a new group chat, since the group hasn't been created yet,
# I can add all the users I have to contacts, so I use the same list given for private chat.
@login_required()
def new_group_chat(request):
    addable = chat_utility_functions.get_addable_users_private_chat(request)
    return render(request, 'new-group-chat.html', {'users': addable, 'len_addable': len(addable)})

# Generates a private chat between the current user and another given participant, redirects us directly to the chat page.
@login_required
def create_chat(request):
    other_username = request.POST.get("other_username")
    other_user = User.objects.get(email=other_username)
    private_chat = PrivateChat()
    new_chat = PrivateChat.add_this(private_chat, request.user, other_user)
    messages = Message.objects.all().filter(chat=new_chat)
    languages = list(LANGUAGE_CHOICES.keys())
    return render(request, 'chat.html', {'user2': other_user, 'id_chat': new_chat.id_chat, 'messages': messages, 'languages': languages})


#takes us back to the private chat page after retrieving the messages
@login_required
def private_chat(request):
    chat_id = request.POST.get("id_chat")
    chat = PrivateChat.objects.get(id_chat=chat_id)
    messages = Message.objects.all().filter(chat=chat)
    if chat.participant1 == request.user:
        participant = chat.participant2
    else:
        participant = chat.participant1
    languages = list(LANGUAGE_CHOICES.keys())
    return render(request, 'chat.html', {'user2': participant, 'id_chat': chat_id, 'messages': messages, 'languages': languages})

# find a group chat given the id and call the function to generate its page
@login_required
def goto_groupchat_from_id(request):
    chat_id = request.POST.get("id_chat")
    if TeacherGroupChat.objects.filter(id_chat=chat_id).exists():
        chat = TeacherGroupChat.objects.get(id_chat=chat_id)
    elif ParentGroupChat.objects.filter(id_chat=chat_id).exists():
        chat = ParentGroupChat.objects.get(id_chat=chat_id)
    elif ResearcherGroupChat.objects.filter(id_chat=chat_id).exists():
        chat = ResearcherGroupChat.objects.get(id_chat=chat_id)
    else:
        chat = None
    return group_chat(request, chat)

# taking a group chat, retrieves messages and participants and redirects us to his page
@login_required
def group_chat(request, chat):
    messages = Message.objects.all().filter(chat=chat)
    participants = chat_utility_functions.get_group_chat_partecipants(request, chat.id_chat)
    return render(request, 'group-chat.html', {'group_chat': chat, 'messages': messages, 'participants': participants,'id_chat': chat.id_chat})

# sends a message given its input fields. It works for both private and group chat as it is the message
# that remembers the chat it belongs to.
@login_required
def send_message(request):
    chat_id = request.POST.get("id_chat")
    chat = Chat.objects.get(id_chat=chat_id)
    text_message = request.POST.get("text-message-input")
    lang = detect_language(text_message)
    if lang != 'en':
        text_message = translate_text(text_message, lang, 'en')
    if len(text_message) > 0:
        messaggio=Message.add_this(Message(), chat, request.user, text_message)
    response = HttpResponse("200")
    return response

#retrieve a message given its id
@login_required
def get_message_by_id(id):
    return Message.objects.all().get(id=id)


#returns the messages of a chat (single or private), in json, it is used for ajax refresh
def get_json_chat_messages(request):
    id_chat = request.POST.get("id_chat")
    chat = Chat.objects.get(id_chat=id_chat)
    new_lang = LANGUAGE_CHOICES.get(request.POST.get("lang"))
    messaggi_query = Message.objects.all().filter(chat=chat)
    messaggi_json_array = []
    for messaggio in messaggi_query:
        message = messaggio.text
        message = translate_text(message, 'en', new_lang)
        msg = {'username': messaggio.sender.email, 'text': message,
               'timestamp': messaggio.timestamp.strftime('%Y-%m-%d %H:%M')}
        messaggi_json_array.append(msg)
    return JsonResponse(messaggi_json_array, safe=False)