from cmath import exp
from urllib import response
from rest_framework.response import Response
from .utilities.csv import *
from .utilities.candidate_round_update import *
from .utilities.questions_update import *
from .utilities.candidate_marks_update import *
from .utilities.filter import *
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
from django.shortcuts import get_object_or_404

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
        # print(self.request.user)
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

    def list(self, request):
        queryset = self.get_queryset()
        section_data = []
        for section in queryset:
            section_data.append(section.id)
        section_total_marks = get_section_total_marks(section_data)
        serializer = SectionsNestedSerializer(queryset,many=True)
        response_data = {
            'section_list': serializer.data,
            'section_total_marks_list': section_total_marks
        }
        return Response(response_data)

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

    def create(self, request):
        section = Sections.objects.get(id=request.data['section_id'])
        round = Rounds.objects.get(id=section.round_id.id)
        if round.type=='test':
            question_id = create_question(request.data)
            data = {
                'round_id':round.id,
                'question_id':question_id
            }
            create_test_candidate_marks_with_question(data)
        if round.type=='interview':
            question_data = {
                'section_id': request.data['section_id'],
                'text': request.data['text'],
                'marks': int(request.data['total_marks']),
                'assignee': None
            }
            question_id = create_question(question_data)
            
            data = {
                'candidate_id': request.data['candidate_id'],
                'question_id': question_id,
                'marks': int(request.data['marks']),
                'remarks': request.data['remarks']
            }
            create_interview_candidate_marks_with_question(data)

        response_data = {
            'status': 'success'
        }
        return Response(response_data,status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        delete_question(pk)
        delete_question_for_all_candidates(pk)
        return Response({'status':'success'},status.HTTP_200_OK)

class InterviewPanelModelViewSet(viewsets.ModelViewSet):
    queryset=InterviewPanel.objects.all()
    serializer_class=InterviewPanelSerializer
    permission_classes=[YearWisePermission]

class CandidatesModelViewSet(viewsets.ModelViewSet):
    queryset=Candidates.objects.all()
    serializer_class=CandidatesNestedSerializer
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
    permission_classes=[YearWisePermission]

    def get_queryset(self):
        r_id = self.request.query_params.get('round_id')
        # print(r_id)
        if r_id is not None:
            return CandidateMarks.objects.filter(question_id__section_id__round_id=r_id)
        return CandidateMarks.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return CandidateMarksNestedSerializer
        return CandidateMarksSerializer

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
                        
        return redirect('http://localhost:3000/logging')

class isUserAuthenticated(APIView):
    def get(self, request):
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

class SectionMarksView(APIView):
    def post(self, request, format=None):
        candidate_list = request.data['candidate_list']
        section_list = request.data['section_list']
        candidate_section_marks_list = []
        if len(candidate_list)>0 and len(section_list):
            for candidate_id in candidate_list:
                candidate_section_data = {
                    'candidate_id': candidate_id,
                    'section_list': section_list
                }
                candidate_section_marks = get_candidate_section_marks(candidate_section_data)
                candidate_section_marks_list.append(candidate_section_marks)
        
        response_data={
            'status':'success',
            'data':candidate_section_marks_list
        }

        return Response(response_data)

class IndividualCandidateSectionMarks(APIView):
    def get(self, request, format=None):
        candidate_section_data = {
            'candidate_id': request.query_params.get('candidate_id'),
            'section_id': request.query_params.get('section_id')
        }
        question_data = get_question_wise_candidate_section_marks(candidate_section_data)
        return Response(question_data)

    def post(self, request, format=None):
        print(request.data)
        section_total_marks = get_interview_candidate_all_section_total_marks(request.data)
        print(section_total_marks)

        response_data = {
            'status':'success',
            'data':section_total_marks
        }
        return Response(response_data)

class FilterCandidatesView(APIView):
    def post(self, request, format=None):
        filter_data = {
            'round_id': request.data['round_id'],
            'section': int(request.data['section']),
            'status': int(request.data['status']),
            'marks': int(request.data['marks']),
            'marks_criteria': request.data['marks_criteria']
        }

        status_round_data = {
            'status': filter_data['status'],
            'round_id': filter_data['round_id']
        }
        candidate_list = filter_by_status(status_round_data)

        filter_section_data = {
            'section': filter_data['section'],
            'candidate_list': candidate_list,
            'round_id': filter_data['round_id']
        }
        candidate_list = filter_by_section(filter_section_data)

        filter_marks_data = {
            'marks': filter_data['marks'],
            'marks_criteria': filter_data['marks_criteria'],
            'candidate_list': candidate_list
        }
        candidate_list = filter_by_marks(filter_marks_data)

        filtered_candidates = []
        for candidate_marks_pair in candidate_list:
            candidate = CandidateRound.objects.get(candidate_id=candidate_marks_pair[0], round_id=filter_data['round_id'])
            serializer = CandidateRoundNestedSerializer(candidate)
            filtered_candidates.append(serializer.data)
        response_data = {
            'status': 'success',
            'data': filtered_candidates
        }
        
        return Response(response_data)