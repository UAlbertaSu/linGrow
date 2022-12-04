from django.db import models
from django.db.models import Count
from django.conf import settings
from django.db.models import Q
from account.models import User, Parent, Teacher, Child, Researcher
from account.enums import UserType
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
    teacher_groups = []
    parent_groups = []
    researcher_groups = []
    if user.is_teacher():
        teacher = Teacher.objects.get(user=user)
        for group in TeacherGroupChat.objects.all().filter(group__teacher__in=[teacher]): 
            teacher_groups.append(group)
        if teacher.school:
            for group in ParentGroupChat.objects.all().filter(Q(group__school=teacher.school, group__owner__isnull=True,group__classroom__isnull=True)):
                parent_groups.append(group)
            
        if teacher.school and teacher.classrooms:
            for group in ParentGroupChat.objects.all().filter(Q(group__classroom__in=teacher.classrooms.all(), group__owner__isnull=True, group__school=teacher.school)):
                parent_groups.append(group)

        for group in ParentGroupChat.objects.all().filter(Q(group__owner=user)): parent_groups.append(group)

    elif user.is_parent():
        parent = Parent.objects.get(user=user)
        for group in ParentGroupChat.objects.all().filter(group__parent__in=[parent]): parent_groups.append(group)

    elif user.is_researcher():
        researcher = Researcher.objects.get(user=user)
        for group in ResearcherGroupChat.objects.all().filter(group__researcher__in=[researcher]): researcher_groups.append(group)
        for group in TeacherGroupChat.objects.all().filter(group__owner=user): teacher_groups.append(group)
        for group in ParentGroupChat.objects.all().filter(group__owner=user) : parent_groups.append(group)

    elif user.is_admin():
        for group in TeacherGroupChat.objects.all().filter(Q(group__owner=user) | Q(group__owner__isnull=True)): teacher_groups.append(group)
        for group in ParentGroupChat.objects.all().filter(Q(group__owner=user) | Q(group__owner__isnull=True)): parent_groups.append(group)
        for group in ResearcherGroupChat.objects.all().filter(group__owner=user): researcher_groups.append(group)
    
    return parent_groups, teacher_groups, researcher_groups


# returns the users with whom I can have a private chat.
def get_addable_users_private_chat(request):
    user = request.user
    if user.is_teacher():
        teacher = Teacher.objects.get(user=user)
        if teacher.school:
            children = Child.objects.all().filter(school=teacher.school)
            parents = set()
            for child in children: parents.add(child.parent.user)
            return list(parents)
    elif user.is_parent():
        children = Child.objects.all().filter(parent=user, school__isnull=False, classroom__isnull=False)
        teachers = set()
        for child in children:
            teachers = Teacher.objects.all().filter(school=child.school, classrooms__id__exact=child.classroom)
            for teacher in teachers: teachers.add(teacher.user)
        return list(teachers)
    elif user.is_researcher() or user.is_admin():
        return list(User.objects.all())


# returns the list of participants of a given group
def get_group_chat_partecipants(request, chat_id):
    if TeacherGroupChat.objects.filter(id_chat=chat_id).exists():
        teacher_group = TeacherGroupChat.objects.get(id_chat=chat_id)
        return list(teacher_group.group.teacher.all()), UserType.TEACHER.value
    if ParentGroupChat.objects.filter(id_chat=chat_id).exists():
        parent_group = ParentGroupChat.objects.get(id_chat=chat_id)
        return list(parent_group.group.parent.all()), UserType.PARENT.value
    if ResearcherGroupChat.objects.filter(id_chat=chat_id).exists():
        researcher_group = ResearcherGroupChat.objects.get(id_chat=chat_id)
        return list(researcher_group.group.researcher.all()), UserType.RESEARCHER.value