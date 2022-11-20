from django.contrib.auth.views import LogoutView
from django.urls import path
from . import views


urlpatterns = [
    path('profile/',views.chat_list, name='profile'),
    path('group_chat/', views.group_list, name='group_chat'),
    path('new_chat/', views.new_chat, name='new_chat'),
    path('new_group_chat/', views.new_group_chat, name='new_group_chat'),
    path('create_chat/', views.create_chat, name='create_chat'),
    path('private_chat/', views.private_chat, name='private_chat'),
    path('group_chat_page/', views.goto_groupchat_from_id, name="group_chat_page"),
    path('send_message/', views.send_message, name='send_message'),
    path('get_group_chat_messages/', views.get_json_chat_messages, name='get_group_chat_messages'),
    path('get_private_chat_messages/', views.get_json_chat_messages, name='get_private_chat_messages')
]
