from django.contrib.auth.views import LogoutView
from django.urls import path
from . import views


urlpatterns = [
    # path('register/',users_views.register, name='register'),
    # path('profile/',views.chat_list, name='profile'),
    path('group_chat/', views.group_list, name='group_chat'),
    # path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    # path('logout/', auth_views.LogoutView.as_view(template_name='logout.html'), name='logout'),
    path('new_chat/', views.new_chat, name='new_chat'),
    path('new_group_chat/', views.new_group_chat, name='new_group_chat'),
    # path('contacts/', contact_views.contacts, name='contacts'),
    # path('addable_contacts/', contact_views.addable_contacts, name='addable_contacts'),
    # path('add_contact/', contact_views.add_contact, name='add_contact'),
    # path('remove_contact/', contact_views.remove_contact, name='remove_contact'),
    path('create_chat/', views.create_chat, name='create_chat'),
    path('create_group/', views.create_group, name='create_group'),
    path('private_chat/', views.private_chat, name='private_chat'),
    path('group_chat_page/', views.goto_groupchat_from_id, name="group_chat_page"),
    path('send_message/', views.send_message, name='send_message'),
    path('add_partecipants/', views.add_partecipants, name='add_partecipants'),
    path('add_users_to_group/', views.add_users_to_group, name='add_users_to_group'),
    path('get_group_chat_messages/', views.get_json_chat_messages, name='get_group_chat_messages'),
    path('get_private_chat_messages/', views.get_json_chat_messages, name='get_private_chat_messages')
]
