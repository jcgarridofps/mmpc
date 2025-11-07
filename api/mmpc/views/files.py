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

        file_name = request.data.get('file_name', '')
        original_file_name = request.POST.get('original_file_name', '')
        checksum = request.POST.get('checksum', '')

        if(file_name == ''):
            return Response({"message":"Missing original_name"},\
                            status=status.HTTP_400_BAD_REQUEST)
        if(original_file_name == ''):
            return Response({"message":"Missing original_file_name"},\
                            status=status.HTTP_400_BAD_REQUEST)
        if(checksum == ''):
            return Response({"message":"Missing checksum"},\
                            status=status.HTTP_400_BAD_REQUEST)

file_name = models.CharField(max_length=256)
    original_file_name = models.CharField(max_length=256)
    checksum = models.CharField(max_length=256)
    handled = models.BooleanField(default=False, help_text="For detecting orphan files")
    date = models.DateTimeField(auto_now=True)

        try:

            new_file = uploadedFile.objects.create( #VOY POR AQUÍ
                file_name = file_name,
                original_file_name = original_file_name,
                checksum = checksum
            )
            new_study_procedure.save()

            if not new_study_procedure:
                return Response({"message": "Error creating new study procedure"},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            #TODO: get actual sampleID from vcf file
            #TODO: add uploader group (uploaderGroup = uploader_group,\)
            new_study_entry = study.objects.create(\
                description = description,\
                sampleId = 'dummySampleID',\
                history_id = history_id,\
                uploader = uploader,\
                studyProcedure = new_study_procedure,\
                variantsFileRoute = file_path,\
                )
            
            new_study_entry.save()

            if not new_study_entry:
                return Response({"message": "Error creating new study"},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            computation_version = computationVersion.objects.get(id = 1) #N/A
            computation_status = computationStatus.objects.get(computationStatus = 'PENDING')

            #TODO: check correct computation version. This may need only a string and confirm version some other way
            new_annotation_entry = annotation.objects.create(\
                pdComputationId = new_analysis_comp_id,\
                version = computation_version,\
                status = computation_status,\
                study = new_study_entry)

            new_annotation_entry.save()

            if not new_annotation_entry:
                return Response({"message":"Error creating annotation"},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            return Response({"message":"New study entry could not be generated into DDBB: "},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = {
            "study_id": new_study_entry.id,
        }
        return Response(data, status=new_analysis_response.status_code)


