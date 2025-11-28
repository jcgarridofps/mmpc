from django.contrib import admin
from .models import *
from django import forms
from django.contrib.auth.admin import GroupAdmin
from django.contrib.admin.widgets import FilteredSelectMultiple



class GroupAdminForm(forms.ModelForm):
    managers = forms.ModelMultipleChoiceField(queryset=customUser.objects.all(), widget=FilteredSelectMultiple(verbose_name='Managers', is_stacked=False))
    permissions = forms.ModelMultipleChoiceField(queryset=Permission.objects.all(), widget=FilteredSelectMultiple(verbose_name='Permissions', is_stacked=False))
    entityGroup = forms.ModelChoiceField(queryset=entityGroup.objects.all())


    class Meta:
        model = Group
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            managers = groupAndCustomUserManager.objects.filter(group=self.instance).values_list('customUser', flat=True)
            self.initial['managers'] = managers

    def save(self, commit=True):
        group = super().save(commit=commit)
        group.save()
        managers = self.cleaned_data['managers']
        entityGroup = self.cleaned_data['entityGroup']
        groupAndCustomUserManager.objects.filter(group=group).delete()
        for customUser in managers:
            groupAndCustomUserManager.objects.create(customUser=customUser, group=group)
        group.entityGroup = entityGroup
        group.save()
        return group

class CustomGroupAdmin(GroupAdmin):
    form = GroupAdminForm
    fieldsets = (
        (None, {'fields': ('name', 'managers', 'permissions', 'entityGroup')}),
    )



# Register your models here.

admin.site.register(customUser)
admin.site.register(entityGroup)
admin.site.unregister(Group)
admin.site.register(Group, CustomGroupAdmin)
