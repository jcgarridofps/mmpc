import datetime
import random
import string
import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Permission
from django.utils import timezone
from django.contrib.auth.models import Group

#aux functions
def generate_default_patient_id():
    # Generate a random 12-character alphanumeric string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

def generate_history_id():
    # Generate a random 12-character alphanumeric string
    return 'PH' + ''.join(random.choices(string.digits, k=10))
def generate_report_id():
    # Generate a random 12-character alphanumeric string
    return 'AR' + ''.join(random.choices(string.digits, k=10))

def generate_annotation_id():
    # Generate a random 12-character alphanumeric string
    return 'SA' + ''.join(random.choices(string.digits, k=10))

def generate_analysis_id():
    # Generate a random 12-character alphanumeric string
    return 'AA' + ''.join(random.choices(string.digits, k=10))

def generate_study_id():
    # Generate a random 12-character alphanumeric string
    return 'HS' + ''.join(random.choices(string.digits, k=10))

# Create your models here.

class entityGroup(models.Model):
    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=200)
    codename = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.label}"

    class Meta:
        verbose_name_plural = "group Entity"

Group.add_to_class('entityGroup', models.ForeignKey(entityGroup, null=False, default=1, on_delete=models.DO_NOTHING))

class customUser(AbstractUser):
    entityGroup = models.ForeignKey(entityGroup, null=False, on_delete=models.DO_NOTHING)
    is_uploader = models.BooleanField(default=False, help_text="Allows user to upload new samples")
    terms_accepted = models.BooleanField(default=False,
                                         help_text="Indicates whether the user has accepted the terms and conditions of the platform")
    username = None
    email = models.EmailField(('email'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

class groupAndCustomUserManager(models.Model):
    id = models.AutoField(primary_key=True)
    customUser = models.ForeignKey(customUser, null=False, on_delete=models.DO_NOTHING)
    group = models.ForeignKey(Group, null=False, on_delete=models.DO_NOTHING)

    class Meta:
        unique_together = (('customUser', 'group'),)

class location(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    latitude = models.CharField(max_length=200)
    longitude = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name_plural = "location"












class computationVersion(models.Model):
    state = models.CharField(max_length=20, unique=True)

class analysisType(models.Model):
    analysis_type = models.CharField(max_length=20, unique=True)

class computationStatus(models.Model):
    computationStatus = models.CharField(max_length=20, unique=True)

class studyProcedureType(models.Model):
    type = models.CharField(max_length=25, unique=True)

class studySample(models.Model):
    sample = models.CharField(max_length=20, unique=True)

class studyPanelVersion(models.Model):
    panelVersion = models.CharField(max_length=20, unique=True)

class studyExomeCapture(models.Model):
    exomeCapture = models.CharField(max_length=20, unique=True)

class sex(models.Model):
    sex = models.CharField(max_length=20, unique=True)

class patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appId = models.CharField(unique=False, default=generate_default_patient_id, max_length=12) # USER STRING, NUHSA
    sex = models.ForeignKey(sex, on_delete=models.DO_NOTHING, null=True)
    dateOfBirth = models.DateField(default=datetime.date(1900,1,1))

class history(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appId = models.CharField(unique=True, default=generate_history_id, max_length=12, editable=False)
    patient = models.ForeignKey(patient, on_delete=models.CASCADE, null = True)



class studyProcedure(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    procedureType = models.ForeignKey(studyProcedureType, on_delete=models.CASCADE)
    sampleKind = models.ForeignKey(studySample, on_delete=models.CASCADE, null=True)
    panelVersion = models.ForeignKey(studyPanelVersion, on_delete=models.CASCADE, null=True),
    exomeCapture = models.ForeignKey(studyExomeCapture, on_delete=models.CASCADE, null=True)
    geneList = models.JSONField(default = dict)

class study(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appId = models.CharField(unique=True, default=generate_study_id, max_length=12, editable=False)
    description = models.CharField(max_length=200)
    studyProcedure = models.ForeignKey(studyProcedure, on_delete=models.CASCADE, null=True)
    date = models.DateField(auto_now=True)
    variantsFileRoute = models.CharField(max_length=200)
    history = models.ForeignKey(history, on_delete=models.CASCADE, null=True)
    uploader = models.ForeignKey(customUser, null=True, on_delete=models.DO_NOTHING)
    sampleId = models.CharField(max_length=60)

class annotation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appId = models.CharField(unique=True, default=generate_annotation_id, max_length=12, editable=False)
    study = models.ForeignKey(study, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(auto_now=True)
    status = models.ForeignKey(computationStatus, on_delete=models.DO_NOTHING, null=True)
    version = models.ForeignKey(computationVersion, on_delete=models.DO_NOTHING, null=True)
    documentId = models.CharField(default='NONE', max_length=200)

class analysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appId = models.CharField(unique=False, default=generate_analysis_id, max_length=12, editable=False, null=True)
    type = models.ForeignKey(analysisType, on_delete=models.CASCADE, null=True)
    annotation = models.ForeignKey(annotation, on_delete=models.CASCADE, null=True)
    version = models.ForeignKey(computationVersion, on_delete=models.DO_NOTHING, null=True)
    status = models.ForeignKey(computationStatus, on_delete=models.DO_NOTHING, null=True)
    date = models.DateTimeField(auto_now=True)
    cancerTypes = models.JSONField(max_length=300, default=dict)
    documentId = models.CharField(default='NONE', max_length=200)

class report(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appId = models.CharField(unique=False, default=generate_history_id, max_length=12, editable=False, null=True)
    analysis = models.ForeignKey(analysis, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(auto_now=True)
    document_id = models.CharField(max_length=60, default="")
    author = models.ForeignKey(customUser, on_delete=models.DO_NOTHING, null=True)


class variantAnalysis(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('PROCESSED', 'Processed')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    description = models.CharField(max_length=30)
    date = models.DateTimeField(auto_now=True)
    computation_id = models.CharField(max_length=60) #Pandrugs computation_id
    uploader = models.ForeignKey(customUser, on_delete=models.DO_NOTHING)
    uploaderGroup = models.ForeignKey(entityGroup, on_delete=models.DO_NOTHING)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    document_id = models.CharField(max_length=60, default="")
    patient = models.ForeignKey(patient, on_delete=models.DO_NOTHING)

class drugQuery(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('PROCESSED', 'Processed')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cancer_types = models.CharField(max_length=500)
    date = models.DateTimeField(auto_now=True)
    variant_analysis = models.ForeignKey(variantAnalysis, on_delete=models.DO_NOTHING)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    document_id = models.CharField(max_length=60, default="")
