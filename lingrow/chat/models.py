from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from json import JSONEncoder
from django.db.models import Max
from account.models import User
from group_management.models import TeacherGroup, ParentGroup, ResearcherGroup

# Create your models here.
# AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')

# Chat, contains id and id_last message
class Chat(models.Model):
    id_chat = models.SmallIntegerField('id_chat', default=-1, primary_key=True)

    # assigns the value next to the greater id as chat_id
    def counter(self):
        if Chat.objects.count() > 0:
            last_chat = Chat.objects.all().order_by('-id_chat')[0]
            no = last_chat.id_chat
        else:
            no = 0
        return no + 1

# Private chat, remember the 2 participants
class PrivateChat(Chat):
    participant1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participant1')
    participant2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participant2')
    unique_together = (('participant1', 'participant2'),)

    #add a private chat

    def add_this(self, user1, user2):
        #check if it exists, if it doesn't exist, create it
        if not self.check_if_exist(user1, user2):
            self.id_chat = self.counter()
            self.participant1 = user1
            self.participant2 = user2
            self.save()
            return self
        #if it exists, it returns the existing instance, it checks the position where our user is
        else:
            is_user_part1 = len(PrivateChat.objects.all().filter(participant1=user1, participant2=user2))
            if is_user_part1 > 0:
                return PrivateChat.objects.all().get(participant1=user1, participant2=user2)
            else:
                return PrivateChat.objects.all().get(participant1=user2, participant2=user1)

    #check if you have a private chat
    def check_if_exist(self, user1, user2):
        if (PrivateChat.objects.filter(participant1=user1, participant2=user2).count() == 0) and (
                PrivateChat.objects.filter(participant1=user2, participant2=user1).count() == 0):
            return False
        else:
            return True

class TeacherGroupChat(Chat):
    group = models.ForeignKey(TeacherGroup, on_delete=models.CASCADE, related_name='group')

class ParentGroupChat(Chat):
    group = models.ForeignKey(ParentGroup, on_delete=models.CASCADE, related_name='group')

class ResearcherGroupChat(Chat):
    group = models.ForeignKey(ResearcherGroup, on_delete=models.CASCADE, related_name='group')


# # Group chat, just remember the group name
# class GroupChannel(Chat):
#     channel_name = models.CharField('channel_name', max_length=255, default=-1)

#     def add_this(self, channel_name):
#         self.id_chat = self.counter()
#         self.channel_name = channel_name
#         self.save()
#         return self



# # Participate, remember the participants of each group using a pair (group, user)
# class Partecipate(models.Model):
#     group_channel = models.ForeignKey(GroupChannel, on_delete=models.CASCADE, related_name='group_channel')
#     participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participant')
#     unique_together = (('group_channel', 'participant'),)

#     #adds a tuple in join given group and user, if the join does not exist
#     def add_this(self, group_channel, user):
#         # if I don't have the participation
#         if not self.check_if_exist(group_channel, user):
#             self.group_channel = group_channel
#             self.participant = user
#             self.save()
#         return

#     #check if there is participation
#     def check_if_exist(self, group_channel, user):
#         if Partecipate.objects.filter(group_channel=group_channel, participant=user).count() == 0:
#             return False
#         else:
#             return True

#Message, remember id, sender, timestamp, text, chat where it belongs
class Message(models.Model):
    id = models.SmallIntegerField('ID', primary_key=True, default=-1)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.CharField('text', max_length=255, default="text")
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)

    #returns as the id to use for a new message, the number following that of the largest id present
    def counter(self):
        if Message.objects.count() > 0:
            # -id means sort by id in descending order
            last_message = Message.objects.all().order_by('-id')[0]
            no = last_message.id
        else:
            no = 0
        return no + 1

    #add a message date chat, sender and text.
    def add_this(self, chat, sender, text):
        self.id = self.counter()
        self.sender = sender
        self.text = text
        self.chat = chat
        self.save()
        return self

