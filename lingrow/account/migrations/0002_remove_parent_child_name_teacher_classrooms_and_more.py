# Generated by Django 4.1.1 on 2022-10-27 06:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('admin_school_management', '0002_remove_classroom_parents_remove_classroom_teachers_and_more'),
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='parent',
            name='child_name',
        ),
        migrations.AddField(
            model_name='teacher',
            name='classrooms',
            field=models.ManyToManyField(blank=True, null=True, to='admin_school_management.classroom'),
        ),
        migrations.AddField(
            model_name='teacher',
            name='school',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='admin_school_management.school'),
        ),
        migrations.CreateModel(
            name='Child',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=255)),
                ('middle_name', models.CharField(blank=True, max_length=255, null=True)),
                ('last_name', models.CharField(max_length=255)),
                ('student_id', models.CharField(max_length=100, unique=True)),
                ('classroom', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='admin_school_management.classroom')),
                ('parent', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='account.parent')),
                ('school', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='admin_school_management.school')),
            ],
        ),
    ]
