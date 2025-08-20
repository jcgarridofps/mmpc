"""
Bridge module to call pandrugs2 API
"""
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import requests

class GetAnalysisResult(APIView):
    """
    Gets results for a given analysis ID.\n
    If analysis is not yet completed, returns current state.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to bypass the request to pandrugs
        """
        #region Incoming params checking
        required_params = ["analysis_id"]
        request_params = request.query_params
        missing_params = []
        for param in required_params:
            if param not in request_params:
                missing_params.append(param)
        if len(missing_params) > 0:
            return Response(json.dumps(\
                {"message": "Some params are missing. Expected params: " +\
                 ''.join(missing_params)}), status = 400)
        #endregion

        #region external request to pandrugs
        analysis_id = request_params["analysis_id"]
        headers = {"Authorization": os.environ['PANDRUGS_AUTH']}
        pd_url = os.environ['PANDRUGS_BASE_URL'] + 'variantsanalysis/guest/' + analysis_id
        pd_response = requests.get(pd_url, headers=headers, timeout=10)
        #endregion

        #region response and status
        if pd_response.status_code == 200:
            return Response(pd_response.json())
        if pd_response.status_code == 404:
            return Response(json.dumps(\
                {"message": f"No data for given analysis ID: {analysis_id}"}),\
                status = 404)
        return Response(json.dumps(\
                {"message": "Unknown error. Please revise your request or try again later."}),\
                status = 500)
        #endregion

class PresenceCheck(APIView):
    """
    Given a gen list, returns lists with those wich pandrugs has or not any treatment for
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET function to bypass the request to pandrugs
        """
        #region Incoming params checking
        required_params = ["gene"]
        request_params = request.query_params
        missing_params = []
        for param in required_params:
            if param not in request_params:
                missing_params.append(param)
        if len(missing_params) > 0:
            return Response(json.dumps(\
                {"message": "Some params are missing. Expected params: " +\
                ''.join(missing_params)}), status = 400)
        #endregion

        #region external request to pandrugs
        headers = {"Authorization": os.environ['PANDRUGS_AUTH']}
        pd_url = os.environ['PANDRUGS_BASE_URL'] + 'genedrug/gene/presence?'
        gene_list = request_params.getlist("gene",default=None)
        param_list = [("gene",value) for value in gene_list]
        pd_response = requests.get(pd_url, headers=headers, params=param_list, timeout=10)
        #endregion

        #region response and status
        if pd_response.status_code == 200:
            return Response(pd_response.json())
        #status 404 not accessible (pandrugs does count as valid any gene string)
        return Response(json.dumps(\
                {"message":"Unknown error. Please revise your request or try again later."}),\
                status = 500)
        #endregion

class NewVariantAnalysis(APIView):
    """
    Starts a new analysis for a given vcf file
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        POST function to bypass request to pandrugs
        """
        #region Incoming params checking
        required_params = ["name"]
        request_params = request.query_params
        missing_params = []
        for param in required_params:
            if param not in request_params:
                missing_params.append(param)
        if len(missing_params) > 0:
            missing_params_response =\
                "Some params are missing.\nExpected params:\n" + ''.join(missing_params)
            return Response(missing_params_response, status = 400)
        #endregion

        #region external request to pandrugs
        headers = {"Authorization": os.environ['PANDRUGS_AUTH']}
        pd_url = os.environ['PANDRUGS_BASE_URL'] + 'variantsanalysis/guest'
        param_list = [("name",request_params.get("name"))]
        vcf_file = request.FILES.get("vcf_file", False)
        file_name = request.data.get("file_name", False)

        if vcf_file is False or file_name is False: #No vcf_file provided
            return Response(json.loads(json.dumps(\
                {"message":"No vcf_file or file_name provided"})), status = 400)

        #vcf_file provided
        form_data = \
            {"withPharmcat":"false",\
            "filename":request.data["file_name"]}
        form_files = {"vcfFile":(vcf_file.name, vcf_file.file, vcf_file.content_type)}
        pd_response = requests.post(\
            pd_url, headers=headers, params = param_list,\
            data=form_data, files=form_files, timeout=10)
        #endregion

        #region response and status
        if pd_response.status_code == 201:
            return Response(json.loads(json.dumps(\
                {"analysis_id":pd_response.headers["Location"].split('/')[-1]})),\
                status = 201)
        return Response(json.dumps(\
                {"message": "Unknown error. Please revise your request or try again later."}),\
                status = 500)
        #endregion
