from dataclasses import fields
from rest_framework import serializers
from .models import *

# User model serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','username','email','password','userpart','year','image','is_active','name']
        extra_kwargs = {
            'password':{ 'write_only' : True }
        }

class UserNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','username','year','name','userpart','email','image']


# RecruitmentSeasons model serializers

class RecruitmentSeasonsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentSeasons
        fields = '__all__'

class RecruitmentSeasonsNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentSeasons
        fields = ['id','name','type']
        

# Rounds model serializers

class RoundsNestedSerializer(serializers.ModelSerializer):
    season_id = RecruitmentSeasonsNameSerializer()
    class Meta:
        model = Rounds
        fields = '__all__'

class RoundsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rounds
        fields = '__all__'

class RoundsNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rounds
        fields = ['id','name','season_id']


# Sections model serializers

class SectionsNestedSerializer(serializers.ModelSerializer):
    round_id = RoundsNameSerializer()
    class Meta:
        model = Sections
        fields = '__all__'

class SectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sections
        fields = '__all__'

class SectionsNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sections
        fields = ['id','name']


# Questions model serializers

class QuestionsNestedSerializer(serializers.ModelSerializer):
    section_id = SectionsNameSerializer()
    assignee = UserSerializer()
    class Meta:
        model = Questions
        fields = '__all__'

class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = '__all__'

class QuestionsNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        exclude = ['assignee']


# Candidates model serializers

class CandidatesNestedSerializer(serializers.ModelSerializer):
    current_round_id = RoundsNameSerializer()
    class Meta:
        model = Candidates
        fields = '__all__'

class CandidatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = '__all__'

class CandidatesNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = ['id','name']


# InterviewPanel model serializers

class InterviewPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewPanel
        fields = '__all__'

class InterviewPanelNestedSerializer(serializers.ModelSerializer):
    season_id = RecruitmentSeasonsNameSerializer()
    panelist = UserNameSerializer(many=True)
    class Meta:
        model = InterviewPanel
        fields = '__all__'


# CandidateMarks model serializers

class CandidateMarksNestedSerializer(serializers.ModelSerializer):
    candidate_id = CandidatesNameSerializer()
    question_id = QuestionsNameSerializer()
    class Meta:
        model = CandidateMarks
        fields = '__all__'

class CandidateMarksSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateMarks
        fields = '__all__'


# CandidateRound model serializers

class CandidateRoundNestedSerializer(serializers.ModelSerializer):
    candidate_id = CandidatesSerializer()
    round_id = RoundsSerializer()
    interview_panel = InterviewPanelSerializer()
    class Meta:
        model = CandidateRound
        fields = '__all__'

class CandidateRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateRound
        fields = '__all__'


# CandidateProjectLink model serializers

class CandidateProjectLinkNestedSerializer(serializers.ModelSerializer):
    candidate_id = CandidatesNameSerializer()
    class Meta:
        model = CandidateProjectLink
        fields = '__all__'

class CandidateProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProjectLink
        fields = '__all__'

# CSV File serializer

class CSVFileSerializer(serializers.Serializer):
    csv_file = serializers.FileField()

#  Move candidate list serializer

class MoveCandidateListSerializer(serializers.Serializer):
    candidate_list = serializers.ListField(child=serializers.IntegerField(), allow_empty=True)
    next_round_id = serializers.IntegerField()
    current_round_id = serializers.IntegerField()

# Section marks serializer

class SectionMarksSerializer(serializers.Serializer):
    candidate_list = serializers.ListField(child=serializers.IntegerField(), allow_empty=True)
    section_list = serializers.ListField(child=serializers.IntegerField(), allow_empty=True)