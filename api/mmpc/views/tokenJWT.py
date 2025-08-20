from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.settings import api_settings
from mmpc.models import customUser
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
import jwt
import base64
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import datetime
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .permissions import IsAdminUser
from django.contrib.auth.signals import user_logged_in
from typing import Any, Dict

print("Django access token lifetime:", api_settings.ACCESS_TOKEN_LIFETIME)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = self.context.get('request')



    def get_token(self, user):

        brand = self.request.data['brand'] #This is a brand intent; the brand login page the user is trying to log into

        actualGroup = Group.objects.get(user = user, entityGroup = user.entityGroup)
        manager = actualGroup.groupandcustomusermanager_set.filter(customUser=user).first()

        token = super().get_token(user)
        """ token.access_token.set_exp(lifetime=datetime.timedelta(seconds=30))
        token.set_exp(lifetime=datetime.timedelta(seconds=30)) """
        #token['exp'] = token.access_token['exp']

        token['email'] = user.email
        token['first_name'] = user.first_name
        token['group'] = { 'id' : actualGroup.id,
                           'name': actualGroup.name
                          }
        token['is_uploader'] = user.is_uploader
        token['terms_accepted'] = user.terms_accepted
        token['entity'] = {
            'label' : user.entityGroup.label,
            'codename' : user.entityGroup.codename
        }

        if manager is not None:
            token['group']['manager'] = True
        else:
            token['group']['manager'] = False

        
        user_logged_in.send(sender=user.__class__, request=self.request, user=user)

        return token
    
"""     def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        data = super().validate(attrs)

        refresh = self.get_token(self.user)
        access_token = refresh.access_token

        access_token.set_exp(lifetime=datetime.timedelta(seconds=30))
        refresh.set_exp(lifetime=datetime.timedelta(seconds=30))

        data['refresh'] = str(refresh)
        data['access'] = str(access_token)

        #data['exp'] = access_token['exp']
        print("EXPIRATION -> " + str(data['exp']))

        return data """


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context



class jwtExtendExpiration(APIView):

    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):

        # get actual jwt token
        token = request.headers.get('Authorization').split(' ')[1]
        
        # decode jwt token
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        # extend duration
        now = datetime.datetime.now(datetime.timezone.utc)
        expires_at = now + datetime.timedelta(days=2) # This is in microsecond (1 milisecond = 1000 miliseconds)
        expires_at_unix = int(expires_at.timestamp()) # Timestamp returns data in seconds
        #decoded_token['exp'] = expires_at_unix

        # encode the updated token
        updated_token = jwt.encode(decoded_token, settings.SECRET_KEY, algorithm='HS256')

        return JsonResponse({'token': updated_token})



class generatePasswordDjango(APIView):

    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        decodedReceived = request.GET.get('decode')

        return JsonResponse({'Encoded' : make_password(decodedReceived)})


class termsConditions(APIView):
    """
    Terms conditions 
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_entity_codename = request.user.entityGroup.codename
        doc_uri = '/api/mmpc/internalDownload/terms.{0}.pdf'.format(user_entity_codename)
        with open(doc_uri, 'rb') as pdf_file:
            encoded_string = base64.b64encode(pdf_file.read()).decode('utf-8')
        return JsonResponse({'file': encoded_string})
    
    
    def post(self, request):
        user = request.user
        user.terms_accepted = True
        user.save()

        refresh = RefreshToken.for_user(user) 

        actualGroup = Group.objects.get(user = user, entityGroup = user.entityGroup)
        manager = actualGroup.groupandcustomusermanager_set.filter(customUser=user).first()

        refresh['email'] = user.email
        refresh['first_name'] = user.first_name
        refresh['group'] = { 'id' : actualGroup.id, 'name': actualGroup.name }
        refresh['is_uploader'] = user.is_uploader
        refresh['terms_accepted'] = user.terms_accepted
        refresh['entity'] = user.entityGroup.label

        if manager is not None:
            refresh['group']['manager'] = True
        else:
            refresh['group']['manager'] = False

        return Response({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=200)