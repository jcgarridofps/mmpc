from rest_framework import permissions
from django.contrib.auth.models import Group


class IsUploaderUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_uploader
    
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        groupAssignedUser = Group.objects.get(user=request.user, entityGroup=request.user.entityGroup).name
        return groupAssignedUser == 'Admin'

class IsManagerOrAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        groupAssignedUser = Group.objects.get(user=request.user, entityGroup=request.user.entityGroup)
        manager = groupAssignedUser.groupandcustomusermanager_set.filter(customUser=request.user).first()
        return manager is not None or groupAssignedUser.name == 'Admin'        