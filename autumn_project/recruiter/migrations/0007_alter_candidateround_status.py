# Generated by Django 4.1.1 on 2022-10-29 22:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recruiter', '0006_alter_recruitmentseasons_description_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidateround',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('not_notified', 'Not Notified'), ('notified', 'Notified'), ('waiting_room', 'In Waiting Room'), ('interview', 'In Interview'), ('done', 'Done')], max_length=16, null=True),
        ),
    ]
