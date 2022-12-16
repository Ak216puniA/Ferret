from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter,SimpleRouter

router = DefaultRouter()

router.register('recruitment_season',RecruitmentSeasonsModelViewSet ,basename='season')
router.register('round',RoundsModelViewSet ,basename='round')
router.register('section',SectionsModelViewSet ,basename='section')
router.register('question',QuestionsModelViewSet ,basename='question')
router.register('user',UsersModelViewSet ,basename='user')
router.register('candidate',CandidatesModelViewSet ,basename='candidate')
router.register('interview_panel',InterviewPanelModelViewSet ,basename='interview_panel')
router.register('candidate_round',CandidateRoundModelViewSet ,basename='candidate_round')
router.register('candidate_marks',CandidateMarksModelViewSet ,basename='candidate_marks')
router.register('candidate_link',CandidateProjectLinkModelViewSet ,basename='candidate_link')

urlpatterns =[
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('auth/auth_code/', getAuthCode.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('api/is_user_authenticated/', isUserAuthenticated.as_view()),
    path('auth/logout/', LogoutView.as_view()),
    path('api/csv/', UploadCSV.as_view()),
    path('api/section_marks/', SectionMarksView.as_view()),
    path('api/candidate_section_marks/', CandidateSectionMarks.as_view()),
    path('api/filter_candidates/', FilterCandidatesView.as_view())
]