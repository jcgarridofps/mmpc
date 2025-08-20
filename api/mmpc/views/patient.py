"""
Module to work with patients in DDBB
"""
from mmpc.models import variantAnalysis, customUser, drugQuery, patient
from mmpc.serializers import variantAnalysisSerializer
from mmpc.views import pandrugs
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import json

def check_patient_exists(patient_identifier):
    res = {'res':False, 'error': False}
    patient_exists = False

    try:
        patient_exists = patient.objects.filter(custom_identifier = patient_identifier).exists()
    except:
        res['error'] = True
    res['res'] = patient_exists

    return res

def get_patient(patient_identifier):
    res = check_patient_exists(patient_identifier)
    if res['error'] == True or res['res'] == False :
        return None
    return patient.objects.get(custom_identifier = patient_identifier)
    

def create_patient(patient_identifier):
    new_patient = patient.objects.create(
                    custom_identifier = patient_identifier,
                )
    new_patient.save()
    return new_patient

class Patient(APIView):
    """
    Get patient from DDBB uploaded by the user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to get patient
        """
        #region Incoming params checking
        patient_identifier = int(request.GET.get('identifier', ''))
        #endregion

        #region fetch data from DDBB
        patient_exists_res = check_patient_exists(patient_identifier)
        if(patient_exists_res['error'] == True):
            return Response({'message': 'Error finding patient on DDBB'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        patient_exists = patient_exists_res['res']
        #endregion

        #region response and status
        return Response(status = status.HTTP_200_OK) if patient_exists\
            else Response({'message':'Selected patient is not registered'},\
                           status = status.HTTP_404_NOT_FOUND)
        #endregion

    def post(self, request):
        """
        POST function to generate new patient DDBB entry
        """
        #region Incoming data checking
        patient_identifier = request.POST.get('custom_identifier', '')

        if(patient_identifier == ''):
            return Response({'message':'no identifier provided for the patient'}, status = status.HTTP_400_BAD_REQUEST)
        #endregion

        #Check if patient already exists
        patient_exists_res = check_patient_exists(patient_identifier)
        if(patient_exists_res['error'] == True):
            return Response({'message': 'Error finding patient on DDBB'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        patient_exists = patient_exists_res['res']

        #region answer or create patient entry
        if patient_exists:
            return Response(status=status.HTTP_200_OK)
        else:
            try:
                create_patient(
                    custom_identifier = patient_identifier,
                )
            except:
                return Response({'message': 'Error creating patient'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({'message': 'Patient successfuly created'}, status=status.HTTP_201_CREATED)
        #endregion


class PatientCount(APIView):
    """
    Get patient entry count from DDBB
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve patient DDBB entry count
        """

        #region fetch data from DDBB
        db_entry_count = 0
        try:
            db_entry_count = patient.objects.count()
        except:
            return Response({'message': 'Error counting patient entries from DDBB'},\
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        #endregion

        #region response and status
        r_data = {'entry_count':db_entry_count}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion
