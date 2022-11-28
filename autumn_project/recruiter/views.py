from cmath import exp
from urllib import response
from rest_framework.response import Response
from .utilities.csv import create_or_update_csv_candidates, create_csv_candidate_marks
from .utilities.candidate_round_update import update_previous_candidate_round_status, create_candidate_round, delete_candidate_round
from .utilities.questions_update import create_question
from .utilities.candidate_marks_update import create_candidate_marks_with_question
from .serializers import *
from .models import *
from rest_framework import viewsets
from rest_framework.views import APIView
import environ
import requests
from .utilities.user_auth import get_user_data,check_and_create_user
from .permissions import YearWisePermission, SuperUserPermission
from rest_framework.permissions import AllowAny
from django.contrib.auth import login,logout
from .serializers import UserSerializer
from django.shortcuts import redirect
from rest_framework import status
import pandas
from django.core.exceptions import ObjectDoesNotExist

env = environ.Env()
environ.Env.read_env()

class UsersModelViewSet(viewsets.ModelViewSet):
    serializer_class=UserSerializer
    permission_classes=[SuperUserPermission]

    def get_queryset(self):
        year = self.request.query_params.get('year')
        if year is not None:
            return Users.objects.filter(year__gte=year)
        return Users.objects.all()

class RecruitmentSeasonsModelViewSet(viewsets.ModelViewSet):
    serializer_class=RecruitmentSeasonsSerializer
    permission_classes=[YearWisePermission]

    def get_queryset(self):
        season_type = self.request.query_params.get('season_type')
        season_id = self.request.query_params.get('season_id')
        print(self.request.user)
        if season_type is not None:
            return RecruitmentSeasons.objects.filter(type=season_type)
        if season_id is not None:
            return RecruitmentSeasons.objects.filter(id=season_id)
        return RecruitmentSeasons.objects.all()
        
class RoundsModelViewSet(viewsets.ModelViewSet):
    permission_classes=[YearWisePermission]

    def get_queryset(self):
        s_id = self.request.query_params.get('season_id')
        if s_id is not None:
            return Rounds.objects.filter(season_id=s_id)
        return Rounds.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return RoundsNestedSerializer
        return RoundsSerializer

class SectionsModelViewSet(viewsets.ModelViewSet):
    queryset=Sections.objects.all()
    permission_classes=[YearWisePermission]

    def get_queryset(self):
        r_id = self.request.query_params.get('round_id')
        if r_id is not None:
            return Sections.objects.filter(round_id=r_id)
        return Sections.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return SectionsNestedSerializer
        return SectionsSerializer

class QuestionsModelViewSet(viewsets.ModelViewSet):
    queryset=Questions.objects.all()
    permission_classes=[YearWisePermission]

    def get_queryset(self):
        sc_id = self.request.query_params.get('section_id')
        if sc_id is not None:
            return Questions.objects.filter(section_id=sc_id)
        return Questions.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return QuestionsNestedSerializer
        return QuestionsSerializer

    def create(self, request, *args, **kwargs):
        question_id = create_question(request.data)

        section = Sections.objects.get(id=request.data['section_id'])
        round = Rounds.objects.get(id=section.round_id.id)
        if round.type=='test':
            data = {
                'round_id':round.id,
                'question_id':question_id
            }
            print(data)
            create_candidate_marks_with_question(data)

        response_data = {
            'status': 'success'
        }
        return Response(response_data,status.HTTP_201_CREATED)

class InterviewPanelModelViewSet(viewsets.ModelViewSet):
    queryset=InterviewPanel.objects.all()
    serializer_class=InterviewPanelSerializer
    permission_classes=[YearWisePermission]

class CandidatesModelViewSet(viewsets.ModelViewSet):
    queryset=Candidates.objects.all()
    serializer_class=QuestionsSerializer
    permission_classes=[YearWisePermission]

class CandidateProjectLinkModelViewSet(viewsets.ModelViewSet):
    queryset=CandidateProjectLink.objects.all()
    serializer_class=CandidateProjectLinkSerializer
    permission_classes=[YearWisePermission]

class CandidateRoundModelViewSet(viewsets.ModelViewSet):
    queryset=CandidateRound.objects.all()
    permission_classes=[YearWisePermission]

    def get_queryset(self):
        r_id = self.request.query_params.get('round_id')
        if r_id is not None:
            return CandidateRound.objects.filter(round_id=r_id)
        return CandidateRound.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return CandidateRoundNestedSerializer
        return CandidateRoundSerializer

    def create(self, request, *args, **kwargs):
        serializer = MoveCandidateListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        move_data = serializer.validated_data

        if move_data['next_round_id']>move_data['current_round_id']:
            for candidate_id in move_data['candidate_list']:
                candidate_data = {
                    'candidate_id': candidate_id,
                    'round_id': move_data['next_round_id']
                }
                create_candidate_round(candidate_data)

                candidate_data = {
                    'candidate_id': candidate_id,
                    'round_id': move_data['current_round_id']
                }
                update_previous_candidate_round_status(candidate_data)

            response_data = {
                "status":"created",
            }
            return Response(response_data,status.HTTP_201_CREATED)

        for candidate_id in move_data['candidate_list']:
            candidate_data = {
                'candidate_id': candidate_id,
                'round_id': move_data['current_round_id']
            }
            delete_candidate_round(candidate_data)

        response_data = {
            "status":"deleted",
        }
        return Response(response_data,status.HTTP_200_OK)


class CandidateMarksModelViewSet(viewsets.ModelViewSet):
    queryset=CandidateMarks.objects.all()
    serializer_class=CandidateMarksSerializer
    permission_classes=[YearWisePermission]   

class getAuthCode(APIView):
    permission_classes=[AllowAny]
    def get(self, request, format=None):
        SITE = env('AUTH_CODE_URL')+"?response_type=code&client_id="+env('CLIENT_ID')+"&redirect_uri=http://localhost:8000/auth/login/&state=foo_success216"
        return redirect(SITE)


class LoginView(APIView):

    permission_classes=[AllowAny]

    def get(self, request, format=None):
        view_response={
            'succesful' : False,
            'desc' : ''
        }

        token_url=env('AUTH_TOKEN_URL')
        request_data = {
            'grant_type':'authorization_code',
            'code' : request.query_params['code'],
            'redirect_uri' : 'http://localhost:8000/auth/login/',
            'client_id' : env('CLIENT_ID'),
            'client_secret' : env('CLIENT_SECRET'),
        }
    
        try:
            response_token = requests.post(url=token_url, data=request_data)
        except Exception as e:
            view_response['succesful']=False
            view_response['desc']=e

        else:
            if response_token.status_code==200:
                view_response['succesful']=False
                view_response['desc']=response_token.json()

                AUTH_TOKEN = response_token.json()['access_token']
                AUTH_TOKEN_TYPE = response_token.json()['token_type']

                token = AUTH_TOKEN_TYPE+' '+AUTH_TOKEN

                user_data = get_user_data(token)

                if user_data is not None:
                    if user_data['is_maintainer']:
                        user_dict = check_and_create_user(user_data)
                        login(request,user_dict['user'])
                        view_response['succesful']=True
                        serializer=UserSerializer(user_dict['user'])
                        view_response['desc']=serializer.data
                        res = Response(status=status.HTTP_202_ACCEPTED)
                        res['Access-Control-Allow-Origin']='http://localhost:3000'
                        res['Access-Control-Allow-Credentials']='true'
                        print(request.user)
                        
        return redirect('http://localhost:3000/logging')

class isUserAuthenticated(APIView):
    def get(self, request):
        print(request.user)
        return Response({'authenticated': request.user.is_authenticated})

class LogoutView(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated:
            logout(request)
            return Response({'logged_out':True})
        return Response({'logged_out':True})

class UploadCSV(APIView):
    def post(self, request, format=None):
        
        serializer =  CSVFileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        csv_file = serializer.validated_data['csv_file']

        csv_reader = pandas.read_csv(csv_file)
        for _, row in csv_reader.iterrows():

            candidate_data = {
                'name': row['name'],
                'email': row['email'],
                'enrollment_no':row['enrollment_no'],
                'year':row['year'],
                'mobile_no':row['mobile_no'],
                'cg':row['cg'],
                'round_id':request.data['round_id']
            }
            candidate_id=create_or_update_csv_candidates(candidate_data)

            candidate_data = {
                'candidate_id':candidate_id,
                'round_id':request.data['round_id']
            }
            create_candidate_round(candidate_data)
            create_csv_candidate_marks(candidate_data)

        candidates = CandidateRound.objects.filter(round_id=request.data['round_id'])
        serializer = CandidateRoundNestedSerializer(candidates, many=True)

        response_data = {
            "status":"success",
            "data":serializer.data
        }

        return Response(response_data,status.HTTP_201_CREATED)