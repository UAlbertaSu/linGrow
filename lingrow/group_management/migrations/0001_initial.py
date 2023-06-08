# Generated by Django 4.1.1 on 2022-11-23 04:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0001_initial'),
        ('admin_school_management', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TeacherGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('classroom', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.classroom')),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.school')),
                ('teacher', models.ManyToManyField(blank=True, related_name='teacher_group', to='account.teacher')),
            ],
            options={
                'verbose_name_plural': 'teacher groups',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='ResearcherGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('classroom', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.classroom')),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('researcher', models.ManyToManyField(related_name='researcher_group', to='account.researcher')),
                ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.school')),
            ],
            options={
                'verbose_name_plural': 'researcher groups',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='ParentGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('classroom', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.classroom')),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('parent', models.ManyToManyField(related_name='parent_group', to='account.parent')),
                ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.school')),
            ],
            options={
                'verbose_name_plural': 'parent groups',
                'ordering': ['name'],
            },
        ),
    ]