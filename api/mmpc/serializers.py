from dataclasses import field
from rest_framework import serializers
from .models import *
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.utils.timezone import now
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class customUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = customUser
        fields = ['id', 'password', 'last_login', 'is_superuser', 'first_name', 'last_name', 'email', 'is_staff',
                  'is_active', 'date_joined', 'user_permissions']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

class locationSerializer(serializers.ModelSerializer):
    class Meta:
        model = location
        fields = ['id', 'name', 'latitude', 'longitude']

class annotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = annotation
        fields = ['id', 'appId', 'date', 'status', 'version']

class drugQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = drugQuery
        fields = ['id', 'cancer_types', 'date', 'status']

class reportSerializer(serializers.ModelSerializer):
    class Meta:
        model = report
        fields = ['id', 'date']

class historySerializer(serializers.ModelSerializer):

    class Meta:
        model = history
        fields = ['appId']

