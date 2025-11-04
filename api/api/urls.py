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

    path('api/annotations/', Annotations.as_view(), name='variant_analysis'),
    path('api/annotations/count/', AnnotationCount.as_view(), name='variant_analysis_count'),
    path('api/annotations/pending/count/', AnnotationPendingCount.as_view(), name='variant_analysis_pending_count'),

    path('api/annotation/', Annotation.as_view(), name='analysis_get_result'),
    path('api/annotation/result/', AnnotationResult.as_view(), name='analysis_get_result'),
    path('api/annotation/presence/', PresenceCheck.as_view(), name='analysis_presence'),
    path('api/annotation/new/', Annotations.as_view(), name='analysis_new'),

    path('api/patient/', Patient.as_view(), name='patient_new'),
    path('api/patient/count/', PatientCount.as_view(), name='patient_count'),
    path('api/patient/', Patient.as_view(), name='patient_exists'),

    path('api/analysis/', Analysis.as_view(), name='drug_query'),
    path('api/analyses/', Analyses.as_view(), name='analyses'),
    path('api/analysis/result/', AnalysisResult.as_view(), name='drug_query_new'),
    path('api/analysis/count/', AnalysisCount.as_view(), name='drug_query_count'),
    path('api/analysis/pending/count/', AnalysisPendingCount.as_view(), name='drug_query_pending_count'),
    path('api/analysis/pending/', AnalysisPending.as_view(), name='drug_queries_pending'),

    path('api/report/', Report.as_view(), name='reports'),
    path('api/report/count/', ReportCount.as_view(), name='drug_query_count'),
    path('api/report/new/', Report.as_view(), name='report_new'),
    path('api/report/result/', ReportResult.as_view(), name='report_result'),

    path('api/history/', History.as_view(), name='history'),
    path('api/history/new/', History.as_view(), name='history_new'),
    path('api/history/patient/', HistoryPatient.as_view(), name='history'),

    path('api/study/', Study.as_view(), name='study'),
    path('api/study/new/', Study.as_view(), name='study_new'),
    path('api/studies/', Studies.as_view(), name='studies'),
    path('api/studies/count/', StudiesCount.as_view(), name='studies'),
]

admin.site.site_header = 'MMPC Administration panel'
