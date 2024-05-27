from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    USER_ROLES = (
        ('admin', 'Admin'),
        ('manager', 'Project Manager'),
        ('member', 'Team Member'),
    )
    role = models.CharField(max_length=20, choices=USER_ROLES, default='member')
    tasks = models.ManyToManyField('tasks.Task', related_name='assigned_to_users', blank=True)
