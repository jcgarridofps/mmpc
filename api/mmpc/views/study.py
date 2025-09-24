"""
View module for managing application reports
"""
from mmpc.models import variantAnalysis, customUser, drugQuery, report, entityGroup, patient, study
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
import json

class Study(APIView):
    """
    Get Study from DDBB
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to retrieve one history entry from DDBB for a given history ID
        """
        # CHECK ALL NEEDED INFO IS PROVIDED
        app_id = request.GET.get('query', '')
        if(app_id == '' or not app_id.startswith('ST')):
            return Response({"message":"Please identify study ID"},\
                            status=status.HTTP_400_BAD_REQUEST)
        
        # FETCH DATA FROM DDBB
        db_object = None
        try:
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
        vcf_file = request.POST.get('file', '')
        history_id = request.POST.get('history_id', '')

    



        """ if(patient_id == ''):
            return Response({"message":"Please identify patient ID"},\
                            status=status.HTTP_400_BAD_REQUEST) """
        

        new_analysis_view = pandrugs.NewVariantAnalysis.as_view()
        new_analysis_response = new_analysis_view(request._request)


        # CREATE STUDY
        """ if new_analysis_response.status_code == 201:
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
        #endregion """
    
        #region response and status
        return Response({"message":"History created successfully", "history_id":new_history.id}, status=status.HTTP_201_CREATED)
        #endregion
