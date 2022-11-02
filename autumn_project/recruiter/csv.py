from .models import *
from django.core.exceptions import ObjectDoesNotExist

def create_or_update_csv_candidates(candidate_data):
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

def create_csv_candidate_round(candidate_data):
    try:
        candidate_round = CandidateRound.objects.get(candidate_id=candidate_data['candidate_id'], round_id=candidate_data['round_id'])
    except ObjectDoesNotExist:
        candidate_round = CandidateRound(
            candidate_id=Candidates.objects.get(id=candidate_data['candidate_id']),
            round_id=Rounds.objects.get(id=candidate_data['round_id'])
            # remark=candidate_data['remark'],
            # interview_Panel=candidate_data['interview_panel'],
            # time_slot=candidate_data['time_slot'],
            # total_marks=candidate_data['total_marks'],
            # status=candidate_data['status']
            )
    # else:
        # candidate_round.remark=candidate_data['remark']
        # candidate_round.interview_panel=InterviewPanel.objects.get(id=candidate_data['interview_panel']) 
        # candidate_round.time_slot=candidate_data['time_slot']
        # candidate_round.total_marks=candidate_data['total_marks']
        # candidate_round.status=candidate_data['status']
    candidate_round.save()

def create_csv_candidate_marks(candidate_data):
    round = Rounds.objects.get(id=candidate_data['round_id'])
    if round.type=='test':
        # print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        round_questions = Questions.objects.filter(section_id__round_id=candidate_data['round_id'])
        for question in round_questions:
            # print(question.text)
            try:
                candidate = CandidateMarks.objects.get(candidate_id=candidate_data['candidate_id'],question_id=question.id)
            except ObjectDoesNotExist:
                candidate = CandidateMarks(
                    candidate_id=Candidates.objects.get(id=candidate_data['candidate_id']),
                    question_id=Questions.objects.get(id=question.id)
                )
            candidate.save()
            print(candidate.candidate_id)
        # try:
        #     candidate_marks = CandidateMarks.objects.get(candidate_id=candidate_marks_data['candidate_id'])
        # except ObjectDoesNotExist:
        #     candidate_marks = CandidateMarks(
        #         candidate_id=Candidates.objects.get(id=candidate_marks_data['candidate_id'])
        #     )
