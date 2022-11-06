# Generated by Django 4.1.1 on 2022-11-03 22:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
        ('admin_school_management', '0001_initial'),
        ('group_management', '0003_parentgroup'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResearcherGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('classroom', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.classroom')),
                ('researcher', models.ManyToManyField(related_name='researcher_group', to='account.teacher')),
                ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_school_management.school')),
            ],
            options={
                'verbose_name_plural': 'researcher groups',
                'ordering': ['name'],
            },
        ),
    ]
