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




class reportSerializer(serializers.ModelSerializer):
    class Meta:
        model = report
        fields = ['id', 'date']

class historySerializer(serializers.ModelSerializer):

    class Meta:
        model = history
        fields = ['id', 'appId']

class studySampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = studySample
        fields = '__all__'

class studyProcedureTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = studyProcedureType
        fields = '__all__'

class studyPhysicalCaptureSerializer(serializers.ModelSerializer):
    procedure = studyProcedureTypeSerializer()
    class Meta:
        model = studyPhysicalCapture
        fields = '__all__'

class studyVirtualCaptureSerializer(serializers.ModelSerializer):
    physical_capture = studyPhysicalCaptureSerializer()
    class Meta:
        model = studyVirtualCapture
        fields = '__all__'

class studyProcedureSerializer(serializers.ModelSerializer):
    sampleKind = studySampleSerializer()
    procedureType = studyProcedureTypeSerializer()
    physicalCapture = studyPhysicalCaptureSerializer()
    virtualCapture = studyVirtualCaptureSerializer()
    class Meta:
        model = studyProcedure
        fields = '__all__'

class studySerializer(serializers.ModelSerializer):
    studyProcedure = studyProcedureSerializer()
    class Meta:
        model = study
        fields = ['id', 'appId', 'description', 'date', 'studyProcedure']

class annotationSerializer(serializers.ModelSerializer):
    status = serializers.SlugRelatedField(
        read_only=True,
        slug_field='computationStatus'
    )
    version = serializers.SlugRelatedField(
        read_only=True,
        slug_field='state'
    )
    study = studySerializer()
    class Meta:
        model = annotation
        fields = ['id', 'appId', 'date', 'status', 'version', 'study']

class analysisSerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(
        read_only=True,
        slug_field='analysis_type'
    )
    status = serializers.SlugRelatedField(
        read_only=True,
        slug_field='computationStatus'
    )
    version = serializers.SlugRelatedField(
        read_only=True,
        slug_field='state'
    )
    annotation = annotationSerializer()
    class Meta:
        model = analysis
        fields = ['id', 'appId', 'type', 'version', 'status', 'date', 'cancerTypes', 'annotation']