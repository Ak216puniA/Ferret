# Generated by Django 4.1.1 on 2022-11-01 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recruiter', '0008_candidates_year_alter_candidates_enrollment_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidates',
            name='cg',
            field=models.CharField(max_length=5),
        ),
    ]