"""
View module for managing application reports
"""
import os
import urllib
from django.conf import settings
from uuid import UUID
from mmpc.models import annotation, customUser, drugQuery, report, entityGroup, patient, history, study, studyProcedure, computationVersion, computationStatus, studyExomeCapture, studyPanelVersion, studyProcedureType, studySample
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
    
class Study(APIView):
    """
    Get Study from DDBB
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve one study entry from DDBB for a given study ID
        """
        # CHECK ALL NEEDED INFO IS PROVIDED
        app_id = request.GET.get('app_id', '')
        study_id = request.GET.get('study_id', '')

        if(app_id == '' and study_id == ''):
            return Response({"message":"Please identify study ID or appId"},\
                            status=status.HTTP_400_BAD_REQUEST)

        if(app_id != '' and not app_id.startswith('ST')):
            return Response({"message":"Please identify study appId"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        # FETCH DATA FROM DDBB
        db_object = None
        try:
            if(study_id != ''):
                db_object = study.objects\
                        .get(id = study_id)
            else:
                db_object = study.objects\
                        .get(appId = app_id)
                
        except study.DoesNotExist:
            return Response({"message":"Provided history not found"},\
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message":"Could not get provided history"},\
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        db_object_data = studySerializer(db_object, many=False)

        #region response and status
        return Response(db_object_data.data, status = status.HTTP_200_OK)
        #endregion

    def post(self, request):
        """
        POST function to generate new history DDBB entry
        Before generating history entry, a patient entry must be generated
        If given patient already exists, throw error
        """
        
        #CHECK ALL NEEDED INFO IS PROVIDED

        description = request.POST.get('description', '')
        gene_list = request.POST.get('gene_list_file', '')
        exome_capture = request.POST.get('exome_capture', '')
        panel_version = request.POST.get('panel_version', '')
        procedure_type = request.POST.get('procedure', '')
        sample_kind = request.POST.get('sample_kind', '')
        vcf_file = request.FILES.get('file')
        gene_list_file = request.FILES.get('gene_list_file')
        history_id = request.POST.get('history_id', '')
        file_name = request.POST.get('file_name', '')
        gene_list_file_name = request.POST.get('gene_list_file_name', '')
        file_name_name = vcf_file.name

        if(history_id == ''):
            return Response({"message":"Please identify history ID"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        #TODO: check modes, gene_list_file, procedure type, etc
        
        if(not vcf_file):
            return Response({"message":"Please add vcf file"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        # --- Save VCF file on disk ---
        file_path = ''

        try:
            # Ensure target folder exists
            save_dir = os.path.join(settings.BASE_DIR, "files")
            os.makedirs(save_dir, exist_ok=True)

            # Use provided file name or fall back to original
            safe_name = file_name or vcf_file.name

            file_path = os.path.join(save_dir, safe_name)

            # Write file to disk
            with default_storage.open(file_path, 'wb+') as destination:
                for chunk in vcf_file.chunks():
                    destination.write(chunk)

        except Exception as e:
            return Response({"message": f"Error saving VCF file: {e}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

        # Ask for a new pandrugs variant analysis
        new_analysis_view = pandrugs.NewVariantAnalysis.as_view() #pandrugs variant analysis
        new_analysis_response = new_analysis_view(request._request)


        # CREATE STUDY
        if new_analysis_response.status_code == 201:
            try:
                new_analysis_id = new_analysis_response.data['analysis_id'] #Pandrugs variant analysis ID
                uploader = customUser.objects.get(email=request.user.email)
                uploader_group = uploader.entityGroup

                #Create the new DDBB entry for the new variant analysis

                # exome_capture = studyExomeCapture.objects.get()
                # panel_version
                procedure_type = studyProcedureType.objects.get(type = procedure_type)
                #sample_kind = studySample.objects.get()

                new_study_procedure = studyProcedure.objects.create(
                    procedureType = procedure_type
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
                    documentId = new_analysis_id,\
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


class Studies(APIView):
    """
    Get variant analysis from DDBB uploaded by the user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve drug query DDBB entries
        """
        #region Incoming params checking
        page = int(request.GET.get('page', '1'))
        query = request.GET.get('query', '') # The user string filter
        decodedQuery = urllib.parse.unquote(query)
        elements = int(request.GET.get('elements', '6')) #Number of elements to be returned
        history_parent_id = UUID(str(request.GET.get('historyId', None)))  #parent history
        history_parent = history.objects.get(id = history_parent_id)
        user = request.user.email
        #endregion

        #region fetch data from DDBB
        db_objects = []
        first_requested_element = (page - 1) * elements
        last_requested_element = first_requested_element + elements
        try:
            if(history_parent != None):
                db_objects = study.objects\
                    .filter(history = history_parent)\
                    .filter(appId__icontains=decodedQuery)\
                    .order_by('-date')\
                    .all()[first_requested_element : last_requested_element]
        except customUser.DoesNotExist:
            db_objects = []
        #endregion
        db_objects_data = studySerializer(db_objects, many=True)

        #region response and status
        return Response(db_objects_data.data, status = status.HTTP_200_OK)
        #endregion
