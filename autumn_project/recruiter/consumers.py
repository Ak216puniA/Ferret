from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .serializers import MoveCandidateListSerializer, CandidateRoundNestedSerializer
from .models import *
from .utilities.candidate_round_update import create_candidate_round, update_previous_candidate_round_status, delete_candidate_round
from channels.db import database_sync_to_async

@database_sync_to_async
def move_candidates_to_further_round(move_data):
    moved_candidate_list = []
    for candidate_id in move_data['candidate_list']:
        candidate_data = {
            'candidate_id': candidate_id,
            'round_id': move_data['next_round_id']
        }
        candidate_round_id = create_candidate_round(candidate_data)
        if candidate_round_id is not None:
            moved_candidate_list.append(candidate_round_id)

        candidate_data = {
            'candidate_id': candidate_id,
            'round_id': move_data['current_round_id']
        }
        update_previous_candidate_round_status(candidate_data)
    print(moved_candidate_list)
    return moved_candidate_list

@database_sync_to_async
def move_candidates_to_previous_round(move_data):
    moved_candidate_list = []
    for candidate_id in move_data['candidate_list']:
        candidate_data = {
            'candidate_id': candidate_id,
            'round_id': move_data['current_round_id']
        }
        candidate_round_id = delete_candidate_round(candidate_data)
        if candidate_round_id is not None:
            moved_candidate_list.append(candidate_round_id)
    return moved_candidate_list

@database_sync_to_async
def get_moved_candidates_data(move_data):
    candidate_list = CandidateRound.objects.filter(candidate_id__in=move_data['candidate_list'], round_id=move_data['next_round_id'])
    serializer = CandidateRoundNestedSerializer(candidate_list, many=True)
    return serializer.data

@database_sync_to_async
def update_panel_status(panel_data):
    panel = InterviewPanel.objects.get(id=panel_data['panel_id'])
    panel.status = panel_data['status']
    panel.save()
    return panel_data

class AsyncSeasonRoundsConsumer(AsyncJsonWebsocketConsumer):
    
    async def candidates_moved(self,event):
        print("SEASON ROUNDS.........................")
        candidates = event['message']
        await self.send_json(candidates)

    async def connect(self):
        self.group_name = 'season_rounds_'+str(self.scope['url_route']['kwargs']['pk'])
        await self.channel_layer.group_add(
            group=self.group_name, 
            channel=self.channel_name
        )
        await self.accept()

    async def receive_json(self, content, **kwargs):
        serializer = MoveCandidateListSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        move_data = serializer.validated_data

        if move_data['next_round_id']>move_data['current_round_id']:
            moved_candidate_ids = await move_candidates_to_further_round(move_data)
            moved_candidate_data = {
                'candidate_list': moved_candidate_ids,
                'next_round_id': move_data['next_round_id']
            }
            moved_candidate_list = await get_moved_candidates_data(moved_candidate_data)
            response_data = {
                'candidate_list': moved_candidate_list,
                'action': 'add',
                'round_id': move_data['next_round_id']
            }
        elif move_data['next_round_id']<move_data['current_round_id']:
            moved_candidate_list = await move_candidates_to_previous_round(move_data)
            response_data = {
                'candidate_list': moved_candidate_list,
                'action': 'delete',
                'round_id': move_data['current_round_id']
            }
        else:
            response_data = []

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'candidates.moved',
                'message': response_data
            }
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, 
            channel=self.channel_name
        )
        await self.close()

class AsyncInterviewPanelsConsumer(AsyncJsonWebsocketConsumer):

    async def panel_updated(self,event):
        panel = event['message']
        await self.send_json(panel)

    async def connect(self):
        self.group_name = 'interview_panels_'+str(self.scope['url_route']['kwargs']['pk'])
        await self.channel_layer.group_add(
            group=self.group_name, 
            channel=self.channel_name
        )
        await self.accept()

    async def receive_json(self, content, **kwargs):
        if content['panel_id'] is not None and content['panel_id']>0:
            response_data = await update_panel_status(content)
        else:
            response_data = []
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'panel.updated',
                'message': response_data
            }
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, 
            channel=self.channel_name
        )
        await self.close()

class AsyncSectionMarksConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("SECTION MARKS.........................")
        self.group_name = 'section_marks_'+str(self.scope['url_route']['kwargs']['pk'])
        await self.channel_layer.group_add(
            group=self.group_name, 
            channel=self.channel_name
        )
        await self.accept()

    async def receive_json(self, content, **kwargs):
        print(content)

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, 
            channel=self.channel_name
        )
        await self.close()