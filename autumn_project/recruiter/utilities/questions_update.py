from recruiter.models import *
from django.core.exceptions import ObjectDoesNotExist

def create_question(question_data):
    try:
        question = Questions.objects.get(section_id=question_data['section_id'], text=question_data['text'])
    except ObjectDoesNotExist:
        question = Questions(
            section_id=Sections.objects.get(id=question_data['section_id']),
            text=question_data['text'],
            marks=question_data['marks'],
            assignee=Users.objects.get(id=question_data['assignee'])
        )
    question.save()
    return question.id