from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import os
import base64
from django.http import JsonResponse


class avatar(APIView):
    """
    Avatars 
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        userId = request.user.id
        pathOrigin = f'/api/mmpc/avatars/'
        pathImageUser = f'{pathOrigin}{userId}.jpg'
        pathImageDefault = f'{pathOrigin}default.jpg'

        result = ''
        if os.path.isfile(pathImageUser): #if is exist image
            result = pathImageUser
        else:
            result = pathImageDefault
        
        with open(result, 'rb') as image:
            base64res = base64.b64encode(image.read())

        return Response(base64res)
    


