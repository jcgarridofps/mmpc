"""
View module for managing application reports
"""
from mmpc.models import variantAnalysis, customUser, drugQuery, report, entityGroup, patient
from mmpc.serializers import reportSerializer
from mmpc.views import pandrugs
from mmpc.views.patient import get_patient, create_patient
from mmpc.views.drug_query import CreateDrugQuery
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from bson import ObjectId
from mmpc.mongo.mongo import db as mdb
import json

class ReportResult(APIView):
    """
    Get report result document from DDBB
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve report DDBB entry for a given report ID
        """
        #region Incoming params checking
        report_id = request.GET.get('id', '')
        #endregion

        #region fetch data from DDBB
        document_id = ""
        try:
            document_id = report.objects.filter(id = report_id)[0].document_id
        except:
            document_id = ""
        #endregion

        collection = mdb["report"]
        document = collection.find_one({"_id" : ObjectId(document_id.replace('"',''))})
        if document and '_id' in document:
            document['_id'] = str(document['_id']) # This is for preventig a type error


        #region response and status
        return Response(document, status = status.HTTP_200_OK)
        #endregion

class Report(APIView):
    """
    Get report from DDBB
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve report DDBB entries for a given drug query
        """
        #region Incoming params checking
        page = int(request.GET.get('page', '1'))
        elements = int(request.GET.get('elements', '6')) #Number of elements to be returned
        drug_query_id = request.GET.get('drug_query_id', '')
        #endregion

        #region fetch data from DDBB
        db_objects = []
        first_requested_element = (page - 1) * elements
        last_requested_element = first_requested_element + elements
        try:
            db_objects = report.objects\
                .filter(drug_query = drug_query_id)\
                .order_by('-date')\
                .all()[first_requested_element : last_requested_element]
        except:
            db_objects = []
        #endregion

        db_objects_data = reportSerializer(db_objects, many=True)

        #region response and status
        return Response(db_objects_data.data, status = status.HTTP_200_OK)
        #endregion

    def post(self, request):
        """
        POST function to generate new report DDBB entries
        """
        
        drug_query = request.POST.get('drug_query', '')
        if(drug_query == ''):
            return Response({"message":"No linked drug_query"},\
                            status=status.HTTP_400_BAD_REQUEST)

        clinical_prescription = request.POST.get('clinical_prescription', '')
        if(clinical_prescription == ''):
            return Response({"message":"Please select a clinical prescription"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        clinical_report = request.POST.get('clinical_report', '') # This is not mandatory

        # Create document
        document = {
            "clinical_prescription": clinical_prescription,
            "clinical_report": clinical_report
        }

        # Save document into DDBB (MONGO)
        try:
            collection = mdb["report"]
            inserted_document = collection.insert_one(document)
        except:
            return Response({"message":"report document could not be saved"},\
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save report entry
        #Create the new DDBB entry for the new variant analysis
        try:
            new_report_entry = report.objects.create(\
                document_id = inserted_document.inserted_id,\
                drug_query_id = drug_query)
            new_report_entry.save()
        except:
            return Response({"message":"report document has been saved, \
                            but report entry could not be created."},\
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
        #region response and status
        return Response(None, status=status.HTTP_201_CREATED)
        #endregion

class ReportCount(APIView):
    """
    Get report entry count from DDBB uploaded by the user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve report DDBB entry count
        """
        #region Incoming params checking
        query = request.GET.get('query', '') # The user string filter
        analysis = request.GET.get('drug_query', '')
        user = request.user.email
        #endregion

        #region fetch data from DDBB
        #TODO: make the query to be filtered
        db_entry_count = 0
        try:
            db_user = customUser.objects.get(email = user)

            if(analysis != ''):
                db_entry_count = report.objects\
                .filter(analysis__id = analysis)\
                .filter(analysis__annotation__study__uploader = db_user)\
                .count()
            else:
                db_entry_count = report.objects\
                .filter(analysis__annotation__study__uploader = db_user)\
                .count()
            
            
        except customUser.DoesNotExist:
            db_entry_count = 0
        #endregion

        #region response and status
        r_data = {'entry_count':db_entry_count}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion
