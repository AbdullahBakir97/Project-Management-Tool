from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.role == 'admin'

class IsProjectManagerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ['admin', 'manager']

# Permission for Members to access their own tasks or Read-Only
class IsMemberOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if request.user.is_authenticated and request.user.role == 'member':
            # Additional check to see if the member is only updating their own tasks
            if view.action in ['update', 'partial_update', 'destroy']:
                task_id = view.kwargs.get('pk')
                return request.user.tasks.filter(id=task_id).exists()
            return True
        return False