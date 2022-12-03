from recruiter.models import *
from django.core.exceptions import ObjectDoesNotExist

def create_question(question_data):
    try:
        question = Questions.objects.get(section_id=question_data['section_id'], text=question_data['text'])
    except ObjectDoesNotExist:
        if question_data['assignee'] is not None:
            question = Questions(
                section_id=Sections.objects.get(id=question_data['section_id']),
                text=question_data['text'],
                marks=question_data['marks'],
                assignee=Users.objects.get(id=question_data['assignee'])
            )
        else:
            question = Questions(
                section_id=Sections.objects.get(id=question_data['section_id']),
                text=question_data['text'],
                marks=question_data['marks'],
            )
    question.save()
    return question.id

def delete_question(question_id):
    try:
        question = Questions.objects.get(id=question_id)
    except ObjectDoesNotExist:
        print("Requested question not found!")
    else:
        question.delete()