from recruiter.models import *
from django.core.exceptions import ObjectDoesNotExist

def create_candidate_round(candidate_data):
    try:
        candidate_round = CandidateRound.objects.get(candidate_id=candidate_data['candidate_id'], round_id=candidate_data['round_id'])
    except ObjectDoesNotExist:
        candidate_round = CandidateRound(
            candidate_id=Candidates.objects.get(id=candidate_data['candidate_id']),
            round_id=Rounds.objects.get(id=candidate_data['round_id'])
            )
    candidate_round.save()

def update_previous_candidate_round_status(candidate_data):
    try:
        candidate_round = CandidateRound.objects.get(candidate_id=candidate_data['candidate_id'], round_id=candidate_data['round_id'])
    except ObjectDoesNotExist:
        candidate_round = CandidateRound(
            candidate_id=Candidates.objects.get(id=candidate_data['candidate_id']),
            round_id=Rounds.objects.get(id=candidate_data['round_id']),
            status='done'
            )
    else:
        candidate_round.status='done'
    candidate_round.save()