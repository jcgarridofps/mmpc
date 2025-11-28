from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import jwt
from django.conf import settings
import base64
from django.utils import timezone
import json
from decimal import Decimal
from datetime import date, datetime



    

class drfLogger:
    @staticmethod
    @database_sync_to_async
    def log_message(clientIp, typeConnection, path, headers, body, response, method):

        from drf_api_logger.models import APILogsModel
        
        xForwardedProto = headers.get('x-forwarded-proto', '').split(',')[0].strip()
        if xForwardedProto == 'https':
            typeConnection = 'wss'
        else:
            typeConnection = 'ws'

        apiPath = f"{typeConnection}://{headers.get('host', '')}{path}"
        xForwardedFor = headers.get('x-forwarded-for', '').split(',')[0].strip()
        clientIpAddress = xForwardedFor if xForwardedFor else clientIp

        try:
            log = APILogsModel(
                added_on=timezone.now(),
                api=apiPath,
                method=method,
                body=body,
                headers=headers,
                client_ip_address=clientIpAddress, 
                response={'message': f'{response}'},
                status_code=200,
                execution_time=0, 
            )
            log.save()
        except Exception as e:
            print(str(e))


class BaseConsumer(AsyncWebsocketConsumer):
    group_name = None  # Will be overridden by derived classes


    class CustomJSONEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, Decimal):
                return str(obj)
            elif isinstance(obj, (date, datetime)):
                return obj.isoformat()
            return json.JSONEncoder.default(self, obj)


    @staticmethod
    def prepare_headers(headers):
        """
        Convert WebSocket headers from a list of tuples to a dictionary.
        """
        return {key.decode('utf-8'): value.decode('utf-8') for key, value in headers}
    


    async def connect(self):
        
        # Extract the Sec-WebSocket-Protocol header
        subprotocols = self.scope.get('subprotocols', [])
        if not subprotocols or len(subprotocols) < 2:
            await self.close(code=1008)  # Close if header is not present
            return

        encoded_token = subprotocols[1]
        padded_encoded_token = encoded_token.replace('-', '+').replace('_', '/')  # Reemplazamos - y _ por + y /
        padded_encoded_token += '=' * ((4 - len(padded_encoded_token) % 4) % 4)
        try:
            token_bytes = base64.b64decode(padded_encoded_token)
        except (base64.binascii.Error, ValueError):
            await self.close(code=1008)  
            return
        
        token = token_bytes.decode('utf-8').replace('Bearer ', '')

        # Decode the token to get the user information
        from mmpc.models import customUser
        try:
            secret_key = settings.SECRET_KEY
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            username = payload.get('email')  # Assume your payload has a 'email' field
            user = await database_sync_to_async(customUser.objects.get)(email=username)
            self.scope["user"] = user
        except (jwt.ExpiredSignatureError, jwt.DecodeError, jwt.InvalidTokenError, customUser.DoesNotExist):
            await self.close(code=1008)  # Close if not authenticated or token is invalid
            return
        
        # If everything goes well and the user is authenticated, accept the connection
        if self.scope.get("user") and self.scope["user"].is_authenticated:

            #Storage log drflogger
            headers = self.prepare_headers(self.scope['headers'])
            await drfLogger.log_message(
                clientIp = self.scope['client'][0],
                typeConnection = self.scope['scheme'],
                path=self.scope['path'],
                headers=headers,
                body={'user': self.scope['user']},
                response = 'WebSocket connection established',
                method = 'WS_INIT'
            )

            await self.channel_layer.group_add(
                self.group_name,  
                self.channel_name
            )

            await self.accept(subprotocol="realProtocol")
        else:
            await self.close(code=1008)


    async def disconnect(self, closeCode):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        raise NotImplementedError("Must be implemented in derived classes")

    async def send_update(self, event):
        raise NotImplementedError("Must be implemented in derived classes")