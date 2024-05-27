import datetime
from django.shortcuts import render
from rest_framework import viewsets,status
from .models import Task, TimeEntry, Comment, File, Event, Project
from .serializers import TaskSerializer, TimeEntrySerializer, CommentSerializer, FileSerializer, EventSerializer, ProjectSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .permissions import IsAdminOrReadOnly, IsProjectManagerOrReadOnly
from django.db.models import Count, Sum
from django.http import JsonResponse
from celery import shared_task
from django.core.mail import send_mail

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectManagerOrReadOnly]
    
    
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsProjectManagerOrReadOnly]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class TimeEntryViewSet(viewsets.ModelViewSet):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    if username and password:
        user = User.objects.create_user(username=username, password=password, email=email)
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    
class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    


@api_view(['GET'])
def task_status_report(request):
    data = Task.objects.values('status').annotate(total=Count('id'))
    return JsonResponse(list(data), safe=False)

@api_view(['GET'])
def project_time_report(request, project_id):
    data = Task.objects.filter(project_id=project_id).aggregate(total_time=Sum('time_spent'))
    return JsonResponse(data)


@shared_task
def send_reminders():
    tasks = Task.objects.filter(due_date__lte=datetime.date.today())
    for task in tasks:
        send_mail(
            'Task Reminder',
            'Reminder: Your task is due today.',
            'from@example.com',
            [task.assignee.email],
            fail_silently=False,
        )
