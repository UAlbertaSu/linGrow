from django.urls import path
from .view_api import ChatListView, GroupChatListView, NewChatView, CreateChatView, PrivateChatView, \
    GroupChatPageView, SendMessageView, ChatMessageView

#URL patterns for chat API
urlpatterns = [
    path('profile/',ChatListView.as_view(), name='profile'),
    path('group_chat/', GroupChatListView.as_view(), name='group_chat'),
    path('new_chat/', NewChatView.as_view(), name='new_chat'),
    # path('new_group_chat/', NewGroupChatView.as_view(), name='new_group_chat'),
    path('create_chat/', CreateChatView.as_view(), name='create_chat'),
    path('private_chat/', PrivateChatView.as_view(), name='private_chat'),
    path('group_chat_page/', GroupChatPageView.as_view(), name="group_chat_page"),
    path('send_message/', SendMessageView.as_view(), name='send_message'),
    path('get_group_chat_messages/', ChatMessageView.as_view(), name='get_group_chat_messages'),
    path('get_private_chat_messages/', ChatMessageView.as_view(), name='get_private_chat_messages')
]
