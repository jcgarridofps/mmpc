"""
View module for managing application reports
"""
from mmpc.models import variantAnalysis, customUser, drugQuery, report, entityGroup, patient, history
from mmpc.serializers import reportSerializer, historySerializer
from mmpc.views import pandrugs
from mmpc.views.patient import get_patient, create_patient
from mmpc.views.analysis import CreateAnalysis
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from bson import ObjectId
from mmpc.mongo.mongo import db as mdb
import json

#TODO
class History(APIView):
    """
    Get history from DDBB
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve one history entry from DDBB for a given history ID
        """
        # CHECK ALL NEEDED INFO IS PROVIDED
        app_id = request.GET.get('query', '')
        if(app_id == '' or not app_id.startswith('EN') or not app_id.startswith('PH')):
            return Response({"message":"Please identify patient ID or history ID"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        # FETCH DATA FROM DDBB
        db_object = None
        try:
            if(app_id.startswith('PH')):
                db_object = history.objects\
                    .get(appId = app_id)
            if(app_id.startswith('EN')):
                db_object = history.objects\
                    .get(patient__appId = app_id)
                
        except history.DoesNotExist:
            return Response({"message":"Provided history not found"},\
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message":"Could not get provided history"},\
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        db_object_data = historySerializer(db_object, many=False)

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

        patient_id = request.POST.get('patient_id', '')
        if(patient_id == ''):
            return Response({"message":"Please identify patient ID"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        patient_sex = request.POST.get('patient_sex', '')
        if(patient_sex == ''):
            return Response({"message":"Please identify patient sex"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        patient_date = request.POST.get('patient_date', '')
        if(patient_date == ''):
            return Response({"message":"Please identify patient date"},\
                            status=status.HTTP_400_BAD_REQUEST)

        #CHECK GIVEN PATIENT DOES NOT EXIST

        if(patient.objects.filter(appId = patient_id).exists()):
            return Response({"message":"Given patient already has a history"},\
                            status=status.HTTP_400_BAD_REQUEST)


        # CREATE PATIENT
        
        patient_obj = None
        try:
            patient_obj = create_patient(patient_id)
        except Exception as e:
            return Response({"message":"Patient ${patient_id} could not be created"},\
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # CREATE HISTORY
        try:
            new_history = history.objects.create(
                        patient = patient_obj,
                    )
            new_history.save()
        except Exception as e:
            return Response({"message":"History for patient ${patient_id} could not be created"},\
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
        #region response and status
        return Response(None, status=status.HTTP_201_CREATED)
        #endregion

