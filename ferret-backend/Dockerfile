FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /backend
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD [“python”, “./backend/manage.py”, “runserver”, “0.0.0.0:8000”]