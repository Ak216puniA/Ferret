from django.urls import path
from .consumers import *

websocket_urlpatterns = [
    path('ws/season_rounds/<int:pk>/', AsyncSeasonRoundsConsumer.as_asgi()),
    path('ws/interview_panels/<int:pk>/', AsyncInterviewPanelsConsumer.as_asgi()),
    path('ws/candidate_question/<int:pk>/', AsyncCandidateQuestionConsumer.as_asgi()),
    path('ws/candidate_round/<int:pk>/', AsyncCandidateRoundConsumer.as_asgi())
]