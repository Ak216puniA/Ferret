# Generated by Django 4.1.1 on 2022-12-04 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recruiter', '0012_alter_candidatemarks_remarks'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]