from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import pandas as pd
from django.db import connection
from psycopg2.extensions import AsIs


       