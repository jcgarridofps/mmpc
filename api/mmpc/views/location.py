from mmpc.models import location
from mmpc.serializers import locationSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class locationList(APIView):
    """
    List locations
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):

        metadata_var = location.objects.all()

        serializer_var = locationSerializer(metadata_var, many=True)
        return Response(serializer_var.data)