FROM python:3
ENV pythonunbuffered 1
WORKDIR /ferret-backend
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD python /ferret-backend/manage.py runserver 0.0.0.0:8000