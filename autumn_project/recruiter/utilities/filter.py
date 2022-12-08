from recruiter.models import *
from recruiter.serializers import *
from .candidate_marks_update import get_candidate_section_marks, get_candidate_total_marks

def filter_by_status(status_round_data):
    candidate_list=[]
    if status_round_data['status'] is not None and status_round_data['status']!='':
        candidate_list = CandidateRound.objects.filter(round_id=status_round_data['round_id'], status=status_round_data['status'])
    else:
        candidate_list = CandidateRound.objects.filter(round_id=status_round_data['round_id'])
    return candidate_list

def filter_by_section(filter_section_data):
    filter_candidate_list = []
    if filter_section_data['section'] is not None and filter_section_data['section'] > 0:
        for candidate in filter_section_data['candidate_list']:
            candidate_section_data = {
                'candidate_id': candidate.candidate_id.id,
                'section_list': [filter_section_data['section']]
            }
            candidate_section_marks = get_candidate_section_marks(candidate_section_data)
            filter_candidate_list.append(candidate_section_marks)
    else:
        for candidate in filter_section_data['candidate_list']:
            candidate_round_data = {
                'candidate_id': candidate.candidate_id.id,
                'round_id': filter_section_data['round_id']
            }
            candidate_total_marks = get_candidate_total_marks(candidate_round_data)
            filter_candidate_list.append(candidate_total_marks)
    return filter_candidate_list

def filter_by_marks(filter_marks_data):
    filter_candidate_list = []
    if filter_marks_data['marks'] is not None and filter_marks_data['marks']>=0:
        if filter_marks_data['marks_criteria']=='absolute':
            filter_candidate_list = [candidate for candidate in filter_marks_data['candidate_list'] if candidate[1]==filter_marks_data['marks']]
        elif filter_marks_data['marks_criteria']=='topPercentage':
            filter_candidate_list = sorted(filter_marks_data['candidate_list'], key= lambda a: a[1], reverse=True)[:int(filter_marks_data['marks']*len(filter_marks_data['candidate_list'])/100)]
        elif filter_marks_data['marks_criteria']=='topMarks':
            filter_candidate_list = sorted(filter_marks_data['candidate_list'], key= lambda a: a[1], reverse=True)[:filter_marks_data['marks']]
    else:
        filter_candidate_list = sorted(filter_marks_data['candidate_list'], key= lambda a: a[1], reverse=True)
    return filter_candidate_list

def filter_by_question_and_status(filter_data):
    if filter_data['question_id'] is not None and filter_data['question_id']>0:
        candidate_marks = CandidateMarks.objects.filter(question_id=filter_data['question_id'])
    else:
        if filter_data['assignee_id'] is not None and filter_data['assignee_id']>0:
            candidate_marks = CandidateMarks.objects.filter(question_id__section_id__round_id=filter_data['round_id'], question_id__assignee=filter_data['assignee_id'])
        else:
            candidate_marks = CandidateMarks.objects.filter(question_id__section_id__round_id=filter_data['round_id'])
    
    if filter_data['question_status'] is not None and len(filter_data['question_status'])>0:
        candidate_marks = candidate_marks.filter(status=filter_data['question_status'])
    
    candidate_ids = [candidate_mark.candidate_id.id for candidate_mark in candidate_marks]
    filter_candidates = CandidateRound.objects.filter(candidate_id__in=candidate_ids, round_id=filter_data['round_id'])

    data = {
        'filter_candidates': filter_candidates,
        'filter_candidate_marks': candidate_marks
    }
    return data
