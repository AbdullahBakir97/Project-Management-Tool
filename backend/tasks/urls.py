from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TimeEntryViewSet, CommentViewSet, ProjectViewSet, FileViewSet, EventViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'files', FileViewSet)
router.register(r'time-entries', TimeEntryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'events', EventViewSet)

urlpatterns = router.urls



urlpatterns = [
    path('', include(router.urls)),
]
