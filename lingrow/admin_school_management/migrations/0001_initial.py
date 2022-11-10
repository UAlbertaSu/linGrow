# Generated by Django 4.1.1 on 2022-10-30 01:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('school_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('address', models.TextField(blank=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone', models.IntegerField(blank=True, null=True, unique=True)),
            ],
            options={
                'verbose_name_plural': 'schools',
                'ordering': ['school_id'],
            },
        ),
        migrations.CreateModel(
            name='Classroom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('class_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.school')),
            ],
            options={
                'verbose_name_plural': 'classrooms',
                'ordering': ['class_id'],
            },
        ),
    ]
