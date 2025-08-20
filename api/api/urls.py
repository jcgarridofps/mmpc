from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt import views as jwt_views

from mmpc.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('maintenance-status/', maintenance_status, name='maintenance_status'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/avatar/', avatar.as_view(), name='avatar'),
    path('api/terms_conditions/', termsConditions.as_view(), name='terms_conditions'),
    path('api/accept_terms_conditions/', termsConditions.as_view(), name='accept_terms_conditions'),
    path('api/jwt_extend/', jwtExtendExpiration.as_view(), name='jwt_extend'),
    path('api/drf_logger/', drfLogger.as_view(), name='drf_logger'),
    path('api/generate_password/', generatePasswordDjango.as_view(), name='generate_password'),

    path('api/variant_analysis/', VariantAnalysis.as_view(), name='variant_analysis'),
    path('api/variant_analysis/count/', VariantAnalysisCount.as_view(), name='variant_analysis_count'),
    path('api/variant_analysis/pending/count/', VariantAnalysisPendingCount.as_view(), name='variant_analysis_pending_count'),

    path('api/analysis/result/', VariantAnalysisResult.as_view(), name='analysis_get_result'),
    path('api/analysis/presence/', PresenceCheck.as_view(), name='analysis_presence'),
    path('api/analysis/new/', VariantAnalysis.as_view(), name='analysis_new'),

    path('api/patient/', Patient.as_view(), name='patient_new'),
    path('api/patient/count/', PatientCount.as_view(), name='patient_count'),
    path('api/patient/', Patient.as_view(), name='patient_exists'),

    path('api/drug_query/', DrugQuery.as_view(), name='drug_query_new'),
    path('api/drug_query/result/', DrugQueryResult.as_view(), name='drug_query_new'),
    path('api/drug_query/count/', DrugQueryCount.as_view(), name='drug_query_count'),
    path('api/drug_query/pending/count/', DrugQueryPendingCount.as_view(), name='drug_query_pending_count'),
    path('api/drug_query/pending/', DrugQueriesPending.as_view(), name='drug_queries_pending'),

    path('api/report/', Report.as_view(), name='reports'),
    path('api/report/count/', ReportCount.as_view(), name='drug_query_count'),
    path('api/report/new/', Report.as_view(), name='report_new'),
    path('api/report/result/', ReportResult.as_view(), name='report_result'),
]

admin.site.site_header = 'MMPC Administration panel'
