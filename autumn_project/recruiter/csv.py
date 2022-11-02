from .models import CandidateRound, Candidates, InterviewPanel, Rounds, Users
from django.core.exceptions import ObjectDoesNotExist

def create_or_update_candidates(candidate_data):
    try:
        candidate = Candidates.objects.get(enrollment_no=candidate_data['enrollment_no'])
    except ObjectDoesNotExist:
        candidate = Candidates(
            name=candidate_data['name'],
            email=candidate_data['email'],
            enrollment_no=candidate_data['enrollment_no'],
            year=candidate_data['year'],
            mobile_no=candidate_data['mobile_no'],
            cg=candidate_data['cg'],
            current_round_id=Rounds.objects.get(id=candidate_data['round_id'])
            )
    else:
        candidate.name=candidate_data['name']
        candidate.email=candidate_data['email']
        candidate.year=candidate_data['year']
        candidate.mobile_no=candidate_data['mobile_no']
        candidate.cg=candidate_data['cg']
        candidate.current_round_id=Rounds.objects.get(id=candidate_data['round_id'])
    candidate.save()
    return candidate.id

def create_candidate_round(candidate_round_data):
    try:
        candidate_round = CandidateRound.objects.get(candidate_id=candidate_round_data['candidate_id'], round_id=candidate_round_data['round_id'])
    except ObjectDoesNotExist:
        candidate_round = CandidateRound(
            candidate_id=Candidates.objects.get(id=candidate_round_data['candidate_id']),
            round_id=Rounds.objects.get(id=candidate_round_data['round_id']),
            # remark=candidate_round_data['remark'],
            # interview_Panel=candidate_round_data['interview_panel'],
            # time_slot=candidate_round_data['time_slot'],
            # total_marks=candidate_round_data['total_marks'],
            # status=candidate_round_data['status']
            )
    # else:
        # candidate_round.remark=candidate_round_data['remark']
        # candidate_round.interview_panel=InterviewPanel.objects.get(id=candidate_round_data['interview_panel']) 
        # candidate_round.time_slot=candidate_round_data['time_slot']
        # candidate_round.total_marks=candidate_round_data['total_marks']
        # candidate_round.status=candidate_round_data['status']
    candidate_round.save()

def create_candidate_marks(candidate_marks_data):
    print("TO-DOOOOOOOOOOOOOOOOO")
