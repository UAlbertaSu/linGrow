# Generated by Django 4.1.1 on 2022-10-27 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_school_management', '0002_remove_classroom_parents_remove_classroom_teachers_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='school',
            name='school_id',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
