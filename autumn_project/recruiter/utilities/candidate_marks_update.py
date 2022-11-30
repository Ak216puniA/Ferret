from recruiter.models import *
from recruiter.serializers import QuestionsSerializer
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

def get_section_total_marks(section_data):
    section_total_marks=[]
    for section_id in section_data:
        section_marks=0
        questions = Questions.objects.filter(section_id=section_id)
        for question in questions:
            section_marks+=question.marks
        section_total_marks.append(section_marks)
    return section_total_marks


def get_candidate_section_marks(candidate_section_data):
    candidate_section_marks = [candidate_section_data['candidate_id']]
    for section_id in candidate_section_data['section_list']:
        section_marks=0
        candidate_section_questions = CandidateMarks.objects.filter(question_id__section_id=section_id, candidate_id=candidate_section_data['candidate_id'])
        for candidate_question in candidate_section_questions:
            section_marks+=candidate_question.marks
        candidate_section_marks.append(section_marks)
    return candidate_section_marks

def get_question_wise_candidate_section_marks(candidate_section_data):
    candidate_section_marks = []
    candidate_marks = CandidateMarks.objects.filter(candidate_id=candidate_section_data['candidate_id'], question_id__section_id=candidate_section_data['section_id'])
    for candidate_question in candidate_marks:
        question = Questions.objects.get(id=candidate_question.question_id.id)
        marks = candidate_question.marks
        remarks = candidate_question.remarks
        status = candidate_question.status

        serializer = QuestionsSerializer(question)

        question_data = {
            'question': serializer.data,
            'marks': marks,
            'remarks': remarks,
            'status': status
        }
        candidate_section_marks.append(question_data)
    return candidate_section_marks