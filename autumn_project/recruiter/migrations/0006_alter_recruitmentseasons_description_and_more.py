# Generated by Django 4.1.1 on 2022-10-27 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recruiter', '0005_alter_candidatemarks_marks_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recruitmentseasons',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='recruitmentseasons',
            name='end',
            field=models.DateField(null=True),
        ),
    ]
