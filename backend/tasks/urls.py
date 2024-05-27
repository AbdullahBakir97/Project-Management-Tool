from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TimeEntryViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'time-entries', TimeEntryViewSet)

urlpatterns = router.urls



urlpatterns = [
    path('', include(router.urls)),
]
