from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .serializers import MoveCandidateListSerializer, CandidateRoundNestedSerializer, CandidateMarksNestedSerializer
from .models import *
from .utilities.candidate_round_update import create_candidate_round, update_previous_candidate_round_status, delete_candidate_round
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist

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

@database_sync_to_async
def update_candidate_marks(candidate_marks_data):
    try:
        candidate_marks = CandidateMarks.objects.get(id=candidate_marks_data['id'])
    except ObjectDoesNotExist:
        return None
    else:
        candidate_marks.marks = candidate_marks_data['marks']
        candidate_marks.save()
        serializer = CandidateMarksNestedSerializer(candidate_marks)
        return serializer.data

@database_sync_to_async
def get_candidate_section_marks(candidate_section_data):
    candidate_section_marks = [candidate_section_data['candidate_id']]
    for section_id in candidate_section_data['section_list']:
        section_marks=0
        candidate_section_questions = CandidateMarks.objects.filter(question_id__section_id=section_id, candidate_id=candidate_section_data['candidate_id'])
        for candidate_question in candidate_section_questions:
            section_marks+=candidate_question.marks
        candidate_section_marks.append(section_marks)
    return candidate_section_marks

@database_sync_to_async
def update_candidate_remarks(candidate_marks_data):
    try:
        candidate_marks = CandidateMarks.objects.get(id=candidate_marks_data['id'])
    except ObjectDoesNotExist:
        return None
    else:
        candidate_marks.remarks = candidate_marks_data['remarks']
        candidate_marks.status = 'checked' if candidate_marks.status=='unchecked' else 'unchecked'
        candidate_marks.save()
        serializer = CandidateMarksNestedSerializer(candidate_marks)
        return serializer.data

@database_sync_to_async
def update_candidate_round_status(candidate_round_data):
    try:
        candidate_round = CandidateRound.objects.get(id=candidate_round_data['id'])
    except ObjectDoesNotExist:
        return None
    else:
        candidate_round.status = candidate_round_data['status']
        candidate_round.save()
        serializer = CandidateRoundNestedSerializer(candidate_round)
        return serializer.data

class AsyncSeasonRoundsConsumer(AsyncJsonWebsocketConsumer):
    
    async def candidates_moved(self,event):
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

class AsyncCandidateQuestionConsumer(AsyncJsonWebsocketConsumer):

    async def candidate_marks(self,event):
        updated_data = event['message']
        await self.send_json(updated_data)
    
    async def connect(self):
        self.group_name = 'candidate_question_'+str(self.scope['url_route']['kwargs']['pk'])
        await self.channel_layer.group_add(
            group=self.group_name, 
            channel=self.channel_name
        )
        await self.accept()

    async def receive_json(self, content, **kwargs):
        if content['field']=='marks':
            candidate_marks = await update_candidate_marks(content)
            if candidate_marks is not None:
                candidate_section_data = {
                    'candidate_id': candidate_marks['candidate_id']['id'],
                    'section_list': content['section_list']
                }
                candidate_section_marks = await get_candidate_section_marks(candidate_section_data)
                response_data = {
                    'field': 'marks',
                    'candidate_marks': candidate_marks,
                    'section_marks': candidate_section_marks,
                    'round_id': content['round_id']
                }
        elif content['field']=='remarks':
            candidate_marks = await update_candidate_remarks(content)
            if candidate_marks is not None:
                response_data = {
                    'field': 'remarks',
                    'candidate_marks': candidate_marks,
                    'round_id': content['round_id']
                }
        else:
            response_data = []

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'candidate.marks',
                'message': response_data
            }
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, 
            channel=self.channel_name
        )
        await self.close()

class AsyncCandidateRoundConsumer(AsyncJsonWebsocketConsumer):

    async def candidate_round(self,event):
        updated_data = event['message']
        await self.send_json(updated_data)
    
    async def connect(self):
        self.group_name = 'candidate_round_'+str(self.scope['url_route']['kwargs']['pk'])
        await self.channel_layer.group_add(
            group=self.group_name, 
            channel=self.channel_name
        )
        await self.accept()

    async def receive_json(self, content, **kwargs):
        candidate_round = await update_candidate_round_status(content)
        if candidate_round is not None:
            response_data = {
                'candidate_round': candidate_round
            }
        else:
            response_data = []

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'candidate.round',
                'message': response_data
            }
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, 
            channel=self.channel_name
        )
        await self.close()