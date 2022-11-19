from django.db import models
from django.db.models import Count
from django.conf import settings
from django.db.models import Q
# from django.contrib.auth.models import User, Parent, Teacher
from account.models import User, Parent, Teacher, Child
from chat.models import Chat, PrivateChat, Message, TeacherGroupChat, ParentGroupChat, ResearcherGroupChat


# checks all private chats in the system and returns those in which the current user
# is present as the first or second participant
def get_user_private_chats(request):
    user_in_p1 = PrivateChat.objects.all().filter(participant1=request.user)
    user_in_p2 = PrivateChat.objects.all().filter(participant2=request.user)
    return user_in_p1 | user_in_p2


# returns all groups for which we have a participation of the current user
def get_user_group_chats(request):
    user = request.user
    groups = []
    if user.is_teacher():
        for group in TeacherGroupChat.objects.all().filter(group__teacher__id__exact=user.id): groups.append(group)
        for group in ParentGroupChat.objects.all().filter(group__owner=user): groups.append(group)

    elif user.is_parent():
        for group in ParentGroupChat.objects.all().filter(group__parent__id__exact=user.id): groups.append(group)

    elif user.is_researcher():
        for group in ResearcherGroupChat.objects.all().filter(group__researcher__id__exact=user.id): groups.append(group)
        for group in TeacherGroupChat.objects.all().filter(group__owner=user): groups.append(group)
        for group in ParentGroupChat.objects.all().filter(group__owner=user) : groups.append(group)

    elif user.is_admin():
        for group in TeacherGroupChat.objects.all().filter(group__owner=user): groups.append(group)
        for group in ParentGroupChat.objects.all().filter(group__owner=user): groups.append(group)
        for group in ResearcherGroupChat.objects.all().filter(group__owner=user): groups.append(group)
    
    # user_groups = Partecipate.objects.all().filter(participant=request.user)
    # return [partecipa.group_channel for partecipa in user_groups]
    return groups


# returns the users with whom I can have a private chat.
def get_addable_users_private_chat(request):
    # contacts = [user for user in contacts_utility_function.get_contacts(request)]
    # return contacts
    user = request.user
    if user.is_teacher():
        teacher = Teacher.objects.get(user=user)
        if teacher.school:
            children = Child.objects.all().filter(school=teacher.school)
            parents = set()
            for child in children: parents.add(child.parent)
            return list(parents)
    elif user.is_parent():
        children = Child.objects.all().filter(parent=user, school__isnull=False, classroom__isnull=False)
        teachers = set()
        for child in children:
            teachers = Teacher.objects.all().filter(school=child.school, classrooms__id__exact=child.classroom)
            for teacher in teachers: teachers.add(teacher)
        return list(teachers)
    elif user.is_researcher() or user.is_admin():
        return list(User.objects.all())

#returns the users in contacts that I have not yet added to a given group
#is used to add users to an already existing group
# def get_addable_user_group_chat(request, chat_id):
#     group = GroupChannel.objects.get(id_chat=chat_id)
#     partecipazioni_query = Partecipate.objects.filter(group_channel=group)
#     partecipazioni = [partecipa for partecipa in partecipazioni_query]
#     partecipants = [partecipante.participant for partecipante in partecipazioni]
#     contacts = contacts_utility_function.get_contacts(request)
#     return [user for user in contacts if user not in partecipants]

# returns the list of participants of a given group
def get_group_chat_partecipants(request, chat_id):
    if TeacherGroupChat.objects.filter(id_chat=chat_id).exists():
        teacher_group = TeacherGroupChat.objects.get(id_chat=chat_id)
        return list(teacher_group.group.teacher.all())
    if ParentGroupChat.objects.filter(id_chat=chat_id).exists():
        parent_group = ParentGroupChat.objects.get(id_chat=chat_id)
        return list(parent_group.group.parent.all())
    if ResearcherGroupChat.objects.filter(id_chat=chat_id).exists():
        researcher_group = ResearcherGroupChat.objects.get(id_chat=chat_id)
        return list(researcher_group.group.researcher.all())
    # group = GroupChannel.objects.get(id_chat=chat_id)
    # partecipazioni_query = Partecipate.objects.filter(group_channel=group)
    # partecipazioni = [partecipa for partecipa in partecipazioni_query]
    # partecipants = [partecipante.participant for partecipante in partecipazioni]
    # return partecipants