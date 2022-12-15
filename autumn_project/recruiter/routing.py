from django.urls import path
from .consumers import AsyncSeasonRoundsConsumer, AsyncInterviewPanelsConsumer

websocket_urlpatterns = [
    path('ws/season_rounds/<int:pk>/', AsyncSeasonRoundsConsumer.as_asgi()),
    path('ws/interview_panels/<int:pk>/', AsyncInterviewPanelsConsumer.as_asgi())
]