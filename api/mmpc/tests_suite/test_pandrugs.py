"""
UNIT TEST for module pandrugs
"""
import json
from django.test import TestCase
from django.contrib.auth.models import Group
from rest_framework.test import APIClient
from ..models import customUser, entityGroup

def log_user(username):
    """
    Handy method to create and log a nre test user
    Assure to call it with a different username each time
    """
    entity_group = entityGroup(
        label = "comunidad_del_anillo_" + username,
        codename = "fellowship"
        )
    entity_group.save()

    group = Group(name = "test_" + username, entityGroup = entity_group)
    group.save()

    user = customUser(
        email = f"test_{username}@test.com",
        entityGroup = entity_group,
        is_uploader = True,
        terms_accepted = True
    )
    user.set_password('efectoDosmil_1900')
    user.save()

    group.user_set.add(user)

    client = APIClient()
    response = client.post(
        '/api/token/',
        {"email":f"test_{username}@test.com", "password":"efectoDosmil_1900", "brand":"fellowship"},
        format = 'json'
    )

    result = json.loads(response.content)
    access_token = result['access']
    return {
        "access_token":access_token, 
        "user":user
        }

class TestGetAnalysisResult(TestCase):
    """Tests for GetAnalysisResult endpoint"""

    def setUp(self):
        """Log the user in and ger access token"""
        log_info = log_user("user_1") #Assure a different user per class
        self.access_token = log_info["access_token"]
        self.user = log_info["user"]

    def test_200(self):
        """ test: Well formed request """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        #set a known registered analysis ID
        url = "/api/analysis/result/?analysis_id=c297488b-bb3b-4313-ab6a-a11a93a4d3ce"
        response = client.get(url)
        response_text = json.dumps(json.loads(response.content))
        self.assertTrue(response.status_code == 200 and response_text.find("finished") != -1)

    def test_400(self):
        """ test: Missing parameters """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        url = "/api/analysis/result/"
        response = client.get(url)
        response_text = json.dumps(json.loads(response.content))
        self.assertTrue(response.status_code == 400 and response_text.find("missing") != -1)

    def test_404(self):
        """ test: Bad analysis ID """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        url = "/api/analysis/result/?analysis_id=c297488b-bb3b-4313-ab6a-a11a93a4d3cz"
        response = client.get(url)
        self.assertTrue(response.status_code == 404)

class TestPresenceCheck(TestCase):
    """Tests for TestPresenceCheck endpoint"""

    def setUp(self):
        """Log the user in and ger access token"""
        log_info = log_user("user_2") #Assure a different user per class
        self.access_token = log_info["access_token"]
        self.user = log_info["user"]

    def test_200(self):
        """ test: Well formed request """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        #set a known registered analysis ID
        url = "/api/analysis/presence/?gene=EPB41L4A&gene=UNC13D"
        response = client.get(url)
        response_text = json.dumps(json.loads(response.content))
        self.assertTrue(response.status_code == 200 and response_text.find("present") != -1)

    def test_400(self):
        """ test: Missing parameters """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        url = "/api/analysis/presence/"
        response = client.get(url)
        response_text = json.dumps(json.loads(response.content))
        self.assertTrue(response.status_code == 400 and response_text.find("missing") != -1)

class TestNewVariantAnalysis(TestCase):
    """Tests for NewVariantAnalysis endpoint"""

    def setUp(self):
        """Log the user in and ger access token"""
        log_info = log_user("user_3") #Assure a different user per class
        self.access_token = log_info["access_token"]
        self.user = log_info["user"]

    def test_201(self):
        """ test: Well formed request """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        url = "/api/analysis/new/?name=test"
        form_data = {}
        test_file_path = "mmpc/tests_suite/test_resources/test.vcf"
        with open(test_file_path, 'r', encoding = "utf-8") as file:
            form_data = {
                "withPharmcat": "false",
                "file_name": "test_pandrugs.py",
                "vcf_file": file
            }
            response = client.post(url, data = form_data, format = 'multipart')
        response_text = json.dumps(json.loads(response.content))
        self.assertTrue(response.status_code == 201 and response_text.find("analysis_id") != -1)

    def test_400_no_vcf_file(self):
        """ test: Missing parameters """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        url = "/api/analysis/new/"
        form_data = {
            "file_name": "test_pandrugs.py",
            }
        response = client.post(url, data = form_data, format = 'multipart')
        self.assertTrue(response.status_code == 400)

    def test_400_no_file_name(self):
        """ test: Missing parameters """
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION= "Bearer " + self.access_token)
        url = "/api/analysis/new/"
        form_data = {}
        test_file_path = "mmpc/tests_suite/test_resources/test.vcf"
        with open(test_file_path, 'r', encoding = "utf-8") as file:
            form_data = {
                "vcf_file": file
            }
            response = client.post(url, data = form_data, format = 'multipart')
        self.assertTrue(response.status_code == 400)
