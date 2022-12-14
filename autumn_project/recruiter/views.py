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
from rest_framework import filters
import pandas

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
        round_id = self.request.query_params.get('round_id')
        assignee_id = self.request.query_params.get('assignee_id')
        question_status = self.request.query_params.get('question_status')
        section_id = self.request.query_params.get('section_id')
        if section_id is not None:
            return Questions.objects.filter(section_id=section_id)
        if round_id is not None and round_id!='':
            queryset = Questions.objects.filter(section_id__round_id=round_id)
            if assignee_id is not None and assignee_id!='':
                queryset = queryset.filter(assignee=assignee_id)
                if question_status is not None and question_status!='':
                    candidate_marks = CandidateMarks.objects.filter(question_id__in=queryset, status=question_status)
                    question_ids = [canidate_mark.question_id.id for canidate_mark in candidate_marks]
                    queryset = queryset.filter(id__in=question_ids)
            return queryset
        return Questions.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return QuestionsNestedSerializer
        return QuestionsSerializer

    def create(self, request):
        section = Sections.objects.get(id=request.data['section_id'])
        round = Rounds.objects.get(id=section.round_id.id)

        if request.data['candidate_id'] is not None:
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
        else:
            question_id = create_question(request.data)
            if round.type=='test':
                data = {
                    'round_id':round.id,
                    'question_id':question_id
                }
                create_test_candidate_marks_with_question(data)

        response_data = {
            'status': 'success'
        }
        return Response(response_data,status.HTTP_201_CREATED)

    # def destroy(self, request, pk=None):
    #     delete_question(pk)
    #     delete_question_for_all_candidates(pk)
    #     return Response({'status':'success'},status.HTTP_200_OK)

class InterviewPanelModelViewSet(viewsets.ModelViewSet):
    permission_classes=[YearWisePermission]

    def get_queryset(self):
        season_id = self.request.query_params.get('season_id')
        if season_id is not None:
            if int(season_id)>0:
                return InterviewPanel.objects.filter(season_id=season_id)
            return InterviewPanel.objects.all()
        return InterviewPanel.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return InterviewPanelNestedSerializer
        return InterviewPanelSerializer

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
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['candidate_id__name']
    ordering = ['candidate_id__name']

    def get_queryset(self):
        round_id = self.request.query_params.get('round_id')
        candidate_id = self.request.query_params.get('candidate_id')
        ready_for_interview = self.request.query_params.get('ready_for_interview')
        interview_panel_id = self.request.query_params.get('interview_panel_id')
        if round_id is not None:
            if ready_for_interview:
                return CandidateRound.objects.filter(round_id=round_id, status__in=['notified','waiting_room'])
            if interview_panel_id:
                return CandidateRound.objects.filter(round_id=round_id, interview_panel=interview_panel_id)
            return CandidateRound.objects.filter(round_id=round_id)
        if candidate_id is not None:
            return CandidateRound.objects.filter(candidate_id=candidate_id)
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
        round_id = self.request.query_params.get('round_id')
        if round_id is not None:
            return CandidateMarks.objects.filter(question_id__section_id__round_id=round_id)
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
        print(request.user.name)
        if request.user.is_authenticated==True:
            response_data = {
                'authenticated': request.user.is_authenticated,
                'username': request.user.username,
                'name': request.user.name,
                'email': request.user.email,
                'year': request.user.year,
                'userpart': request.user.userpart
            }
        else:
            response_data = {
                'authenticated': request.user.is_authenticated,
                'username': '',
                'name': '',
                'email': '',
                'year': 0,
                'userpart': ''
            }
        return Response(response_data)

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
    def get(self, request):
        candidate_id = request.query_params.get('candidate_id')
        response_data = []
        rounds = Rounds.objects.filter(season_id=request.query_params.get('season_id'))
        round_info = []
        for round in rounds:
            try:
                candidate_round = CandidateRound.objects.get(candidate_id=candidate_id, round_id=round.id)
            except ObjectDoesNotExist:
                pass
            else:
                candidate_round_serializer = CandidateRoundOnlyRoundSerializer(candidate_round)
                candidate_round_data = {
                    'candidate_id': candidate_id,
                    'round_id': round.id
                }
                round_total_marks = get_candidate_total_marks(candidate_round_data)
                round_info.append([candidate_round_serializer.data, round_total_marks[1]])
                sections = Sections.objects.filter(round_id=round.id)
                candidate_section_data = {
                    'candidate_id': candidate_id,
                    'section_list': [section.id for section in sections]
                }
                candidate_section_wise_marks = get_candidate_section_marks(candidate_section_data)

                index=1
                for section in sections:
                    round_info.append([section.name, candidate_section_wise_marks[index]])
                    index+=1

                response_data.append(round_info)
                round_info = []

        return Response(response_data)

    def post(self, request):
        candidate_list = request.data['candidate_list']
        section_list = request.data['section_list']
        candidate_section_marks_list = []
        if len(candidate_list)>0 and len(section_list)>0:
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

class CandidateSectionView(APIView):
    def get(self, request):
        candidate_section_data = {
            'candidate_id': request.query_params.get('candidate_id'),
            'section_id': request.query_params.get('section_id'),
            'question_id_list': request.query_params.get('question_id')
        }
        question_data = get_candidate_question_data(candidate_section_data)
        return Response(question_data)

    def post(self, request):
        section_total_marks = get_interview_candidate_all_section_total_marks(request.data)
        response_data = {
            'status':'success',
            'data':section_total_marks
        }
        return Response(response_data)

class FilterCandidatesView(APIView):
    def post(self, request, format=None):
        if request.data['checking_mode']:
            filter_data = request.data
            filtered_data = filter_by_question_and_status(filter_data)
            candidate_round_serializer = CandidateRoundNestedSerializer(filtered_data['filter_candidates'], many=True)
            filtered_candidates = candidate_round_serializer.data
        else:
            filter_data = {
                'round_id': request.data['round_id'],
                'section': int(request.data['section']),
                'status': request.data['status'],
                'marks': int(request.data['marks']),
                'marks_criteria': request.data['marks_criteria'],
                'date': request.data['date'],
                'time': request.data['time']
            }

            status_round_data = {
                'status': filter_data['status'],
                'round_id': filter_data['round_id']
            }
            candidate_list = filter_by_status(status_round_data)

            date_time_data = {
                'candidate_list': candidate_list,
                'date': filter_data['date'],
                'time': filter_data['time']
            }
            candidate_list = filter_by_time_slot(date_time_data)

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

            candidate_id_list = [candidate_marks_pair[0] for candidate_marks_pair in candidate_list]
            filtered_candidates = CandidateRound.objects.filter(candidate_id__in=candidate_id_list, round_id=filter_data['round_id']).order_by('candidate_id__name')
            serializer = CandidateRoundNestedSerializer(filtered_candidates, many=True)

        response_data = {
            'status': 'success',
            'data': serializer.data
        }
        return Response(response_data)