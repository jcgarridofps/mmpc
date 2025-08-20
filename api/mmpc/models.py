import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Permission
from django.utils import timezone
from django.contrib.auth.models import Group


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

class patient(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    custom_identifier = models.CharField(unique=True, max_length=60)
    

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

class report(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    drug_query = models.ForeignKey(drugQuery, on_delete=models.DO_NOTHING)
    date = models.DateTimeField(auto_now=True)
    document_id = models.CharField(max_length=60, default="")
