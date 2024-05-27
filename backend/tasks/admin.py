from django.contrib import admin
from .models import Project, Task, File, TimeEntry, Event, Comment
from accounts.models import CustomUser


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'description')
    search_fields = ('name', 'description')
    list_filter = ('start_date', 'end_date')


class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status', 'priority', 'assigned_to', 'due_date')
    search_fields = ('title', 'description')
    list_filter = ('status', 'priority', 'project')
    date_hierarchy = 'due_date'


class FileAdmin(admin.ModelAdmin):
    list_display = ('task', 'uploaded_by', 'uploaded_at')
    search_fields = ('task__title',)
    list_filter = ('uploaded_at',)


class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'start_time', 'end_time', 'duration')
    search_fields = ('task__title', 'user__username')
    list_filter = ('start_time', 'end_time')


class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date', 'project')
    search_fields = ('title',)
    list_filter = ('start_date', 'end_date')


class CommentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'content', 'created_at')
    search_fields = ('content', 'task__title', 'user__username')
    list_filter = ('created_at',)


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_superuser', 'is_active')


admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(File, FileAdmin)
admin.site.register(TimeEntry, TimeEntryAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(CustomUser, CustomUserAdmin)