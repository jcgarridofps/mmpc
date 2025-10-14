"""
Bridge module to call pandrugs2 API
"""
import urllib.parse
from mmpc.models import annotation, customUser, analysis, entityGroup, patient
from mmpc.serializers import annotationSerializer
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

class Annotation(APIView):
    """
    Get annotation by annotation_Id
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve annotation entry by annotation_id
        """
        #region Incoming params checking
        user = request.user.email
        annotation_id = request.GET.get('annotation_id', '')
        #endregion

        if(annotation_id == ''):
            return Response({"message":"An annotation_id is needed"},\
                            status=status.HTTP_400_BAD_REQUEST)

        #region fetch data from DDBB
        db_object = None
        try:
            db_object = annotation.objects\
                .get(id = annotation_id)
        except customUser.DoesNotExist:
            return Response({"message":"Object not found"},\
                            status=status.HTTP_404_NOT_FOUND)
        #endregion

        db_object_data = annotationSerializer(db_object, many=False)

        #region response and status
        return Response(db_object_data.data, status = status.HTTP_200_OK)
        #endregion


class Annotations(APIView):
    """
    Get variant analysis from DDBB uploaded by the user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve variant analysis DDBB entries
        """
        #region Incoming params checking
        page = int(request.GET.get('page', '1'))
        query = request.GET.get('query', '') # The user string filter
        elements = int(request.GET.get('elements', '6')) #Number of elements to be returned
        user = request.user.email
        studyId = request.GET.get('studyId','')
        #endregion

        #region fetch data from DDBB
        db_objects = []
        first_requested_element = (page - 1) * elements
        last_requested_element = first_requested_element + elements
        try:
            if(studyId):
                db_user = customUser.objects.get(email = user)
                db_objects = annotation.objects\
                    .filter(study__uploader = db_user)\
                    .filter(study__id = studyId)\
                    .order_by('-date')\
                    .all()[first_requested_element : last_requested_element]
            else:
                db_user = customUser.objects.get(email = user)
                db_objects = annotation.objects\
                    .filter(study__uploader = db_user)\
                    .order_by('-date')\
                    .all()[first_requested_element : last_requested_element]
        except customUser.DoesNotExist:
            db_objects = []
        #endregion

        db_objects_data = annotationSerializer(db_objects, many=True)

        #region response and status
        return Response(db_objects_data.data, status = status.HTTP_200_OK)
        #endregion

    def post(self, request):
        """
        POST function to generate new variant analysis DDBB entries
        This endpoint makes use of pandrugs.py endpoints
        """

        raw_description = request.GET.get('name', '')
        description = urllib.parse.unquote(raw_description)
        if(len(description) > 30):
            return Response({"Description must be at most 30 characters long."},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        patient_identifier = request.POST.get('patient_identifier', '')
        if(patient_identifier == ''):
            return Response({"message":"A patient identifier is needed"},\
                            status=status.HTTP_400_BAD_REQUEST)

        cancer_types = request.POST.get('cancer_types', '') # The user string filter //TODO: get cancer types from body
        if(len(cancer_types) < 3):
            return Response({"message":"At least one cancer type must be selected"},\
                            status=status.HTTP_400_BAD_REQUEST)

        new_analysis_view = pandrugs.NewVariantAnalysis.as_view()
        new_analysis_response = new_analysis_view(request._request)

        # If the new analysis has been created (in pandrugs)
        if new_analysis_response.status_code == 201:
            try:
                new_analysis_id = new_analysis_response.data['analysis_id']
                uploader = customUser.objects.get(email=request.user.email)
                uploader_group = uploader.entityGroup

                #Create or get patient
                patient_ref = None
                
                try:
                    patient_ref = get_patient(patient_identifier)
                    if patient_ref is None:
                        patient_ref = create_patient(patient_identifier)
                except Exception as e:
                    print("Error getting or creating patient")
                    return Response({"message":"Error creating variant analysis"},\
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                #Create the new DDBB entry for the new variant analysis

                new_analysis_entry = annotation.objects.create(\
                    description=description,\
                    computation_id=new_analysis_id,\
                    uploader = uploader,\
                    uploaderGroup = uploader_group,\
                    status = 'PENDING',\
                    patient = patient_ref)
                new_analysis_entry.save()

                analysis_create_result = CreateDrugQuery(\
                    cancer_types=cancer_types,\
                    parent_analysis_id=new_analysis_entry.id\
                )

                if analysis_create_result:
                    return Response(None, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message":"Variant analysis registered, but couldn't create drug query"},\
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            except Exception as e:
                return Response({"message":"New entry could not be generated into DDBB: "},\
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        #region response and status
        return Response(new_analysis_response.data, status=new_analysis_response.status_code)
        #endregion

class AnnotationResult(APIView):
    """
    Get result for the given variant analysis
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve variant analysis result from mongoDB
        """
        #region Incoming params checking
        annotation_id = request.GET.get('id', '1')
        #endregion

        #region fetch document_id from postgres DDBB

        try:
            analysis = annotation.objects.filter(id = annotation_id)[0]
        except analysis.DoesNotExist:
            analysis = None
        #endregion

        document_id = analysis.document_id

        # get actual document from mongodb

        collection = mdb["variant_analysis"]
        document = collection.find_one({"_id" : ObjectId(document_id.replace('"',''))})
        if document and '_id' in document:
            document['_id'] = str(document['_id']) # This is for preventig a type error

        #region response and status
        return Response(document, status = status.HTTP_200_OK)
        #endregion

class AnnotationCount(APIView):
    """
    Get variant analysis entry count from DDBB uploaded by the user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve variant analysis DDBB entry count
        """
        #region Incoming params checking
        query = request.GET.get('query', '') # The user string filter
        user = request.user.email
        #endregion

        #region fetch data from DDBB
        db_entry_count = 0
        try:
            db_user = customUser.objects.get(email = user)
            db_entry_count = annotation.objects\
                .filter(study__uploader = db_user)\
                .count()
        except customUser.DoesNotExist:
            db_entry_count = 0
        #endregion

        #region response and status
        r_data = {'entry_count':db_entry_count}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion

class AnnotationPendingCount(APIView):
    """
    Get pending variant analysis entry count from DDBB uploaded by the user group
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve pending variant analysis DDBB entry count
        """

        #region identify user
        user = request.user.email
        #endregion

        #region fetch data from DDBB
        db_entry_count = 0
        try:
            db_user = customUser.objects.get(email = user)
            db_entry_count = annotation.objects\
                .exclude(status__computationStatus = 'PROCESSED')\
                .count()
        except Exception as e:
            print('Error fetching pending variant analysis count ' + str(e))
            return Response({'message': 'Error fetching pending variant analysis count'}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        #endregion

        #region response and status
        r_data = {'entry_count':db_entry_count}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion

class AnnotationPending(APIView):
    """
    Get pending variant analysis entries from DDBB uploaded by any user group
    No filters
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve pending variant analysis DDBB entries uploaded by any user
        """

        #region fetch data from DDBB
        try:
            db_entries = annotation.objects\
                .exclude(status = 'PROCESSED')\
                .all()
        except Exception as e:
            print('Error fetching pending variant analysis ' + str(e))
            return Response({'message': 'Error fetching pending variant analysis'}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        #endregion

        #region response and status
        r_data = {'entries':db_entries}
        return Response(data = r_data, status = status.HTTP_200_OK)
        #endregion
