"""
View module for managing uploaded files
"""
import os
import urllib
from django.conf import settings
from uuid import UUID
from mmpc.models import uploadedFile, annotation, customUser, drugQuery, report, entityGroup, patient, history, study, studyProcedure, computationVersion, computationStatus, studyExomeCapture, studyPanelVersion, studyProcedureType, studySample
from mmpc.serializers import reportSerializer, studySerializer
from mmpc.views import pandrugs
from mmpc.views.patient import get_patient, create_patient
from mmpc.views.analysis import CreateAnalysis
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from bson import ObjectId
from mmpc.mongo.mongo import db as mdb
from django.db import models
import json
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
    
class RegisterFile(APIView):
    """
    Register a new uploaded file
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        POST function to generate new history DDBB entry
        Before generating history entry, a patient entry must be generated
        If given patient already exists, throw error
        """
        
        #CHECK ALL NEEDED INFO IS PROVIDED

        file_name = request.data.get('filename', '')
        original_file_name = request.data.get('originalName', '')
        checksum = request.data.get('sha256', '')

        if(file_name == ''):
            return Response({"message":"Missing original_name"},\
                            status=status.HTTP_400_BAD_REQUEST)
        if(original_file_name == ''):
            return Response({"message":"Missing original_file_name"},\
                            status=status.HTTP_400_BAD_REQUEST)
        if(checksum == ''):
            return Response({"message":"Missing checksum"},\
                            status=status.HTTP_400_BAD_REQUEST)

        try:

            new_file = uploadedFile.objects.create(
                file_name = file_name,
                original_file_name = original_file_name,
                checksum = checksum
            )
            new_file.save()

            if not new_file:
                return Response({"message": "Error creating new study procedure"},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            return Response({"message":"New study entry could not be generated into DDBB: "},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = {
            "file_id": new_file.id,
        }
        return Response(data, status=status.HTTP_201_CREATED)


