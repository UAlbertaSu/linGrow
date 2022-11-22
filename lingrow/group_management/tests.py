from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
# Create your tests here.

class Group_Test(APITestCase):

    parent_group_url = '/api/group/parentgroup/'
    researcher_group_url = '/api/group/researchergroup/'
    teacher_group_url = '/api/group/teachergroup/'
    school_url = '/api/school/'
    school_data = {
        "name": "Test School",
        "school_id": "123456",
        "address": "Test Address",
        "email": "school@email.com"
    }
    admin_data = {
        "email": "admin@admin.com",
        "password": "Admin@123",
        "password2": "Admin@123",
        "user_type": 4,
        "first_name": "Admin",
        "last_name": "Admin"
    }

    def create_admin(self):
        '''
        Helper function to create an admin user
        '''
        response = self.client.post('/api/user/register/', self.admin_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.json()['token']['access'])

    def test_default_groups(self):
        self.create_admin()
        self.client.post(self.school_url, self.school_data, format='json')
        response = self.client.get(self.parent_group_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

