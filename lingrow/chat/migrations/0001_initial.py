# Generated by Django 4.1.1 on 2022-11-20 02:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id_chat', models.SmallIntegerField(default=-1, primary_key=True, serialize=False, verbose_name='id_chat')),
            ],
        ),
        migrations.CreateModel(
            name='ParentGroupChat',
            fields=[
                ('chat_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='chat.chat')),
            ],
            bases=('chat.chat',),
        ),
        migrations.CreateModel(
            name='PrivateChat',
            fields=[
                ('chat_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='chat.chat')),
            ],
            bases=('chat.chat',),
        ),
        migrations.CreateModel(
            name='ResearcherGroupChat',
            fields=[
                ('chat_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='chat.chat')),
            ],
            bases=('chat.chat',),
        ),
        migrations.CreateModel(
            name='TeacherGroupChat',
            fields=[
                ('chat_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='chat.chat')),
            ],
            bases=('chat.chat',),
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.SmallIntegerField(default=-1, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('text', models.CharField(default='text', max_length=255, verbose_name='text')),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.chat')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
