# Generated by Django 4.1.1 on 2022-11-15 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
        ('group_management', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teachergroup',
            name='teacher',
            field=models.ManyToManyField(blank=True, related_name='teacher_group', to='account.teacher'),
        ),
    ]
