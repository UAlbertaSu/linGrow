# Generated by Django 4.1.1 on 2022-10-27 23:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_school_management', '0003_alter_school_school_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='class_id',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
