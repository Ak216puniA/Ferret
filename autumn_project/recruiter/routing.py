from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/season_rounds/<int:pk>/', consumers.AsyncSeasonRoundsConsumer.as_asgi())
]