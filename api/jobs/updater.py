from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
from apscheduler.triggers.cron import CronTrigger
from .jobs import deleteOldFastq, updateGeoipFile, createBackupBD
from os import environ

## EXAMPLE  TRIGGER ##
#trigger1 = CronTrigger(day_of_week='mon', hour='8-')
#trigger2 = CronTrigger(day_of_week='tue-thu', hour='*')
#trigger3 = CronTrigger(day_of_week='fri', hour='-17')
#sched.add_job(job1, 'or', trigger1, trigger2, trigger3)

## STANDARD ##
#scheduler.add_job(createBackupBD, 'interval', seconds=10, id="createBackupBD", replace_existing=True)

## INTERVAL ##
#scheduler.add_job(createBackupBD, 'interval', seconds=10, id="createBackupBD", replace_existing=True)

geoip2UpdateStatus = environ.get('AUTOUPDATE_GEOIP2_STATUS')
backupBD = environ.get('BACKUPBD_STATUS')


def start():

        scheduler = BackgroundScheduler()
        scheduler.add_jobstore(DjangoJobStore(), "default")

        #Jobs statics
        triggerDeleteOldFastq = CronTrigger(day='*', hour='3', minute='5')
        scheduler.add_job(deleteOldFastq, triggerDeleteOldFastq, replace_existing=True, id="deleteOldFastq")

        #Jobs dinamics
        if backupBD == 'start':
                triggerBackupDB = CronTrigger(day='*', hour='0', minute='5')
                scheduler.add_job(createBackupBD, triggerBackupDB, replace_existing=True, id="createBackupBD")

        if geoip2UpdateStatus == 'start':
                triggerGeoip2 = CronTrigger(day='*', hour='5', minute='5')
                scheduler.add_job(updateGeoipFile, triggerGeoip2, replace_existing=True, id="updateGeoipFile")

        scheduler.start()
