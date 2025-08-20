from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_api_logger.models import APILogsModel
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from .permissions import IsAdminUser
from datetime import datetime


class drfLogger(APIView):
    """
    Save error Log
    """
    permission_classes = [IsAuthenticated, IsAdminUser]


    def post(self, request, format=None):

        try:
            messageError = request.data['message']
            clientIp = request.META.get('HTTP_X_FORWARDED_FOR', request.META['REMOTE_ADDR']).split(',')[0].strip()
            
            log = APILogsModel(
                added_on = datetime.now(),
                api= request.path,
                method=request.method,
                body=messageError,
                headers=dict(request.headers),
                client_ip_address=clientIp,
                response={'message': 'Error'},
                status_code=500,  
                execution_time = 0,
            )
            log.save()
            
            return Response({'message': 'log created'})

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)