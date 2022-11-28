from recruiter.models import *
from django.core.exceptions import ObjectDoesNotExist

def create_candidate_marks_with_question(data):
    try:
        candidate_rounds = CandidateRound.objects.filter(round_id=data['round_id'])
    except:
        print("No candidate_round instances found")
    else:
        for candidate_round in candidate_rounds:
            try:
                candidate_marks = CandidateMarks.objects.get(candidate_id=candidate_round.candidate_id.id, question_id=data['question_id'])
            except ObjectDoesNotExist:
                candidate_marks = CandidateMarks(
                    candidate_id=Candidates.objects.get(id=candidate_round.candidate_id.id),
                    question_id=Questions.objects.get(id=data['question_id'])
                    )
            candidate_marks.save()