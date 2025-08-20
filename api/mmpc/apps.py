from django.apps import AppConfig
import os


class MmpcConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mmpc'

    def ready(self):
            from axes_banned import signals

            if os.environ.get('JOBS_STATUS') == 'start' and (os.environ.get('RUN_MAIN') or os.environ.get('DJANGO_RUNNING_WITH_GUNICORN')):
                from jobs import updater
                updater.start() 
