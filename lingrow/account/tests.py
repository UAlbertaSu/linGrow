from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Parent, Teacher, Researcher, Admin
from django.forms.models import model_to_dict
# Create your tests here.

class AccountTests(APITestCase):
    user_data = {
                    "email": "testnew@parent.com",
                    "first_name": "First",
                    "middle_name": "Middle",
                    "last_name": "Last",
                    "user_type": 1,
                    "child_name": "Child",
                    "password": "testpassword",
                    "password2": "testpassword"
                }
    login_url = '/api/user/login/'
    register_url = '/api/user/register/'
    profile_url = '/api/user/profile/'
    change_pass_url = '/api/user/changepassword/'
    reset_pass_url = '/api/user/send-reset-password-email/'

    def test_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Parent.objects.count(), 1)
        self.assertEqual(Admin.objects.count(), 0)
        self.assertEqual(Teacher.objects.count(), 0)
        self.assertEqual(Researcher.objects.count(), 0)
        self.assertEqual(Parent.objects.get().user, User.objects.get())
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.user_data['email'],
            "password": self.user_data['password']
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = {
            "email": self.user_data['email'],
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_profile(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.user_data['email'],
            "password": self.user_data['password']
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.json()['token']['access']
        response = self.client.get(self.profile_url, HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['user']['email'], self.user_data['email'])
        self.assertEqual(response.json()['user']['first_name'], self.user_data['first_name'])
        self.assertEqual(response.json()['user']['middle_name'], self.user_data['middle_name'])
        self.assertEqual(response.json()['user']['last_name'], self.user_data['last_name'])
        self.assertEqual(response.json()['user']['user_type'], self.user_data['user_type'])
        self.assertEqual(response.json()['child_name'], self.user_data['child_name'])

    def test_change_password(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.user_data['email'],
            "password": self.user_data['password']
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.json()['token']['access']
        data = {
            "old_password": self.user_data['password'],
            "password": "newpassword",
            "password2": "mismatchpassword"
        }
        response = self.client.post(self.change_pass_url, data, HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {
            "old_password": "wrongpassword",
            "password": "newpassword",
            "password2": "newpassword"
        }
        response = self.client.post(self.change_pass_url, data, HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {
            "old_password": self.user_data['password'],
            "password": "newpassword",
            "password2": "newpassword"
        }
        response = self.client.post(self.change_pass_url, data, format='json', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = {
            "email": self.user_data['email'],
            "password": "newpassword"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_email(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.user_data['email']
        }
        response = self.client.post(self.reset_pass_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    

    


    