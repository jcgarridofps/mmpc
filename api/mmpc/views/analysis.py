"""
Bridge module to call pandrugs2 API
"""
import urllib.parse
from mmpc.models import customUser, drugQuery, analysis, variantAnalysis, entityGroup, patient, computationStatus
from mmpc.serializers import analysisSerializer
from mmpc.views import pandrugs
from mmpc.views.patient import get_patient, create_patient
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from pymongo import MongoClient
from bson import ObjectId
from mmpc.mongo.mongo import db as mdb
import json

def CreateAnalysis(cancer_types, annotation_id, status_entry):

    success = False
    normalized_cancer_types = json.loads(cancer_types.replace(' ', '_').upper())
    try:
        new_analysis_entry = analysis.objects.create(\
                        cancerTypes=normalized_cancer_types,\
                        annotation_id = annotation_id,
                        status = status_entry,
                    )
        new_analysis_entry.save()
        success = True
    except Exception as e:
        print("Error inserting new drug query into DDBB: ")
        print(e)
        success = False
    return success

class Analysis(APIView):
    """
    Get variant analysis from DDBB uploaded by the user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve analysis DDBB entries
        """
        #region Incoming params checking
        page = int(request.GET.get('page', '1'))
        query = request.GET.get('query', '') # The user string filter
        decodedQuery = urllib.parse.unquote(query)
        elements = int(request.GET.get('elements', '6')) #Number of elements to be returned
        annotation_id = request.GET.get('annotation_id', None) #parent annotation
        user = request.user.email
        #endregion

        #region fetch data from DDBB
        db_objects = []
        first_requested_element = (page - 1) * elements
        last_requested_element = first_requested_element + elements
        try:
            if(annotation_id != None):
                db_objects = analysis.objects\
                    .filter(annotation_id = annotation_id)\
                    .filter(cancerTypes__icontains=decodedQuery)\
                    .order_by('-date')\
                    .all()[first_requested_element : last_requested_element]
            else:
                db_objects = analysis.objects\
                    .order_by('-date')\
                    .all()[first_requested_element : last_requested_element]
        except customUser.DoesNotExist:
            db_objects = []
        #endregion

        db_objects_data = analysisSerializer(db_objects, many=True)

        #region response and status
        return Response(db_objects_data.data, status = status.HTTP_200_OK)
        #endregion

    def post(self, request):
        """
        POST function to generate new analysis DDBB entries
        This endpoint makes use of pandrugs.py endpoints
        """

        annotation_id = request.data.get('annotation_id', None)
        if(annotation_id is None):
            return Response({"message":"Annotation id is missing"},\
                            status=status.HTTP_400_BAD_REQUEST)

        cancer_types = request.data.get('cancer_types', '') # The user string filter //TODO: get cancer types from body
        if(cancer_types == ''):
            return Response({"message":"At least one cancer type must be selected"},\
                            status=status.HTTP_400_BAD_REQUEST)

        # If the new analysis has been created (in pandrugs)
        try:

            status_entry = computationStatus.objects.get(computationStatus = "PENDING")

            analysis_create_result = CreateAnalysis(\
                cancer_types = cancer_types,\
                annotation_id = annotation_id,\
                status_entry = status_entry,
            )

            if analysis_create_result:
                return Response(None, status=status.HTTP_201_CREATED)
            else:
                return Response({"message":"Drug query not created"},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            return Response({"message":"New entry could not be generated into DDBB"},\
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        #region response and status
        return Response(new_analysis_response.data, status=new_analysis_response.status_code)
        #endregion

class AnalysisResult(APIView):
    """
    Get result for the given drug query
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve drug query result from mongoDB
        """
        #region Incoming params checking
        query_id = request.GET.get('id', '1')
        #endregion

        #region fetch document_id from postgres DDBB

        try:
            query = analysis.objects.filter(id = query_id)[0]
        except analysis.DoesNotExist:
            query = None
        #endregion

        print(query)

        document_id = query.document_id

        # get actual document from mongodb

        collection = mdb["drug_query"]
        document = collection.find_one({"_id" : ObjectId(document_id.replace('"',''))})
        if document and '_id' in document:
            document['_id'] = str(document['_id']) # This is for preventig a type error

        #region response and status
        return Response(document, status = status.HTTP_200_OK)
        #endregion

class AnalysisCount(APIView):
    """
    Get variant analysis entry count from DDBB uploaded by the user
    With filters
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve drug query DDBB entry count
        """
        #region Incoming params checking
        query = request.GET.get('query', '') # The user string filter
        decodedQuery = urllib.parse.unquote(query)
        variant_analysis_id = request.GET.get('variant_analysis_id', '')
        db_user = request.user
        #endregion

        #region fetch data from DDBB
        db_entry_count = 0
        try:

            if(len(variant_analysis_id) > 0):

                db_entry_count = drugQuery.objects\
                    .filter(variant_analysis__uploader = db_user)\
                    .filter(variant_analysis__id = variant_analysis_id)\
                    .filter(cancer_types__icontains = decodedQuery)\
                    .count()
                
            else:
                db_entry_count = drugQuery.objects\
                    .filter(variant_analysis__uploader = db_user)\
                    .count()
        except:
            db_entry_count = 0
        #endregion

        #region response and status
        r_data = {'entry_count':db_entry_count}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion



class AnalysisPendingCount(APIView):
    """
    Get pending variant analysis entry count from DDBB uploaded by the user group
    No filters
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve pending variant analysis DDBB entry count
        """

        #region fetch data from DDBB
        db_entry_count = 0
        try:
            db_entry_count = drugQuery.objects\
                .exclude(status = 'PROCESSED')\
                .count()
        except Exception as e:
            print('Error fetching pending drug query count ' + str(e))
            return Response({'message': 'Error fetching drug query count'}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        #endregion

        #region response and status
        r_data = {'entry_count':db_entry_count}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion

class AnalysisPending(APIView):
    """
    Get pending variant analysis entries from DDBB uploaded by any user group
    No filters
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve pending variant analysis DDBB entries uploaded by any user
        No filters
        """

        #region fetch data from DDBB
        try:
            db_entries = drugQuery.objects\
                .exclude(status = 'PROCESSED')\
                .all()
        except Exception as e:
            print('Error fetching pending drug queries ' + str(e))
            return Response({'message': 'Error fetching drug queries'}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        #endregion

        #region response and status
        r_data = {'entries':db_entries}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion
