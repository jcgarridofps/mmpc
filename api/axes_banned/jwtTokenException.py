from rest_framework.views import exception_handler
from rest_framework_simplejwt.exceptions import InvalidToken
from axes.handlers.proxy import AxesProxyHandler
from django.contrib.auth import get_user_model
from django.http import HttpRequest



def customExceptionHandler(exc, context):
    response = exception_handler(exc, context)
    
    if isinstance(exc, InvalidToken):
        token_header = context['request'].headers.get('Authorization', '')

        if 'Bearer' in token_header:
            token = token_header.split('Bearer ')[1].strip()
        else:
            token = '' 
        
        new_request = HttpRequest()
        new_request.method = context['request'].method
        new_request.COOKIES = context['request'].COOKIES
        new_request.META = context['request'].META
        new_request.FILES = context['request'].FILES
        new_request.POST = context['request'].data.copy()
        new_request.GET['token incorrect'] = token
        

        AxesProxyHandler().user_login_failed(
            sender=get_user_model(),
            request=new_request,
            credentials={}
        )

        response.data = {
            "detail": "Given token not valid for any token type",
            "code": "token_not_valid",
            "messages": [
                {
                    "token_class": "AccessToken",
                    "token_type": "access",
                    "message": "Token is invalid or expired"
                }
            ]
        }

    return response


