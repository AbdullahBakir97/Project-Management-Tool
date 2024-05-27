from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TimeEntryViewSet, CommentViewSet, ProjectViewSet, FileViewSet, EventViewSet, register, task_status_report, project_time_report

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'files', FileViewSet)
router.register(r'time-entries', TimeEntryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'events', EventViewSet)





urlpatterns = [
    path('', include(router.urls)),

    path('register/', register, name='register'),
    path('task-status-report/', task_status_report, name='task_status_report'),
    path('project-time-report/<int:project_id>/', project_time_report, name='project_time_report'),
    
]
