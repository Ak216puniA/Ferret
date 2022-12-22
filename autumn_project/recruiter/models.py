from email.policy import default
from operator import mod
from tkinter import N
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    first_name=None
    last_name=None
    last_login=models.DateTimeField(auto_now=True)
    date_joined=models.DateField(auto_now_add=True)
    name=models.CharField(max_length=255,null=True,blank=True)

    class UserpartForUser(models.TextChoices):
        DEVELOPER = 'developer', _('Developer')
        DESIGNER = 'designer', _('Designer')

    userpart=models.CharField(max_length=16,choices=UserpartForUser.choices,default=UserpartForUser.DEVELOPER)
    year=models.IntegerField(default=0)
    image=models.ImageField(null=True,blank=True)

    def __str__(self):
        return self.username

class RecruitmentSeasons(models.Model):
    name=models.CharField(max_length=16)
    start=models.DateField(auto_now_add=True)
    end=models.DateField(null=True)
    description=models.TextField(null=True,blank=True)

    class TypeOfSeason(models.TextChoices):
        DEVELOPER = 'developer', _('Developer')
        DESIGNER = 'designer', _('Designer')

    type=models.CharField(max_length=16,choices=TypeOfSeason.choices,blank=False,default=TypeOfSeason.DEVELOPER)
    image=models.ImageField(null=True)

    def __str__(self):
        return self.name

class Rounds(models.Model):
    season_id=models.ForeignKey(RecruitmentSeasons,on_delete=models.CASCADE)
    name=models.CharField(max_length=255)

    class TypeOfRound(models.TextChoices):
        TEST = 'test', _('Test')
        INTERVIEW = 'interview', _('Interview')

    type=models.CharField(max_length=16,choices=TypeOfRound.choices,blank=False,default=TypeOfRound.TEST)

class Sections(models.Model):
    round_id=models.ForeignKey(Rounds,on_delete=models.CASCADE)
    name=models.CharField(max_length=255)
    weightage=models.IntegerField()

class Questions(models.Model):
    section_id=models.ForeignKey(Sections,on_delete=models.CASCADE)
    text=models.TextField()
    marks=models.IntegerField()
    assignee=models.ForeignKey(Users,on_delete=models.CASCADE,null=True)

    def __str__(self):
        return self.text

class Candidates(models.Model):
    name=models.CharField(max_length=255)
    email=models.EmailField(max_length=255)
    enrollment_no=models.IntegerField(unique=True)
    year=models.IntegerField(default=1)
    mobile_no=models.CharField(max_length=16)
    cg=models.IntegerField()
    current_round_id=models.ForeignKey(Rounds,on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class InterviewPanel(models.Model):
    season_id=models.ForeignKey(RecruitmentSeasons,on_delete=models.CASCADE)
    panel_name=models.CharField(max_length=64)
    panelist=models.ManyToManyField(Users)
    location=models.CharField(max_length=64)

    class StatusOfPanel(models.TextChoices):
        INACTIVE = 'inactive', _('Inactive')
        OCCUPIED = 'occupied', _('Occupied')
        IDLE = 'idle', _('Idle')
        ON_BREAK = 'on_break', _('On Break')

    status=models.CharField(max_length=16,choices=StatusOfPanel.choices,default=StatusOfPanel.INACTIVE)

    def __str__(self):
        return self.panel_name

class CandidateMarks(models.Model):
    candidate_id=models.ForeignKey(Candidates,on_delete=models.CASCADE)
    question_id=models.ForeignKey(Questions,on_delete=models.CASCADE)
    marks=models.IntegerField(default=0)
    remarks=models.TextField(null=True,blank=True)

    class StatusOfQuestion(models.TextChoices):
        CHECKED = 'checked', _('Checked')
        UNCHECKED= 'unchecked', _('Unchecked')

    status=models.CharField(max_length=16,choices=StatusOfQuestion.choices,default=StatusOfQuestion.UNCHECKED)

class CandidateRound(models.Model):
    candidate_id=models.ForeignKey(Candidates,on_delete=models.CASCADE)
    round_id=models.ForeignKey(Rounds,on_delete=models.CASCADE)
    remark=models.TextField(null=True, blank=True)
    interview_panel=models.ForeignKey(InterviewPanel,on_delete=models.CASCADE,null=True, blank=True)
    date=models.DateField(null=True)
    # time_slot=models.CharField(max_length=64,null=True, blank=True)
    time=models.TimeField(null=True)
    total_marks=models.IntegerField(null=True, blank=True)

    class StatusOfRound(models.TextChoices):
        PENDING = 'pending', _('Pending')
        NOT_NOTIFIED = 'not_notified', _('Not Notified')
        NOTIFIED = 'notified', _('Notified')
        WAITING_ROOM = 'waiting_room', _('In Waiting Room')
        INTERVIEW = 'interview', _('In Interview')
        DONE = 'done', _('Done')

    status=models.CharField(max_length=16,choices=StatusOfRound.choices,default=StatusOfRound.PENDING)

class CandidateProjectLink(models.Model):
    candidate_id=models.ForeignKey(Candidates,on_delete=models.CASCADE)
    link=models.TextField()

    def __str__(self):
        return self.candidate_id