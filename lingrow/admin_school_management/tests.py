from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status


class SchoolTests(APITestCase):
    '''
    Test cases for the following endpoints:
    - /api/schools/
    - /api/schools/<int:pk>/
    - /api/schools/<int:pk>/classroom/
    - /api/schools/<int:pk>/classroom/<int:pk>/
    '''
    school_url = '/api/school/'
    classroom_url = '/classroom/'
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
    classroom_data = {
        "name": "Test Classroom",
        "class_id": "123456"}

    def create_admin(self):
        '''
        Helper function to create an admin user
        '''
        response = self.client.post('/api/user/register/', self.admin_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.json()['token']['access'])

    def test_create_school(self):
        '''
        Test case for creating a school
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['school']['name'], self.school_data['name'])
        self.assertEqual(response.data['school']['school_id'], self.school_data['school_id'])
        self.assertEqual(response.data['school']['address'], self.school_data['address'])
        self.assertEqual(response.data['school']['email'], self.school_data['email'])

    def test_list_schools(self):
        '''
        Test case for listing all schools
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(self.school_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_school(self):
        '''
        Test case for retrieving a school
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(self.school_url + str(response.data['school']['id']) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.school_data['name'])
        self.assertEqual(response.data['school_id'], self.school_data['school_id'])
        self.assertEqual(response.data['address'], self.school_data['address'])
        self.assertEqual(response.data['email'], self.school_data['email'])

    def test_delete_school(self):
        '''
        Test case for deleting a school
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.delete(self.school_url + str(response.data['school']['id']) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_school(self):
        '''
        Test case for updating a school
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_data = {
            "name": "Test School 2",
            "school_id": "982412",
        }
        response = self.client.patch(self.school_url + str(response.data['school']['id']) + '/', new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], new_data['name'])
        self.assertEqual(response.data['school_id'], new_data['school_id'])

    def test_create_classroom(self):
        '''
        Test case for creating a classroom
        '''
        self.create_admin()
        response = self.client.post(self.school_url + '1' + self.classroom_url, self.classroom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.post(self.school_url, self.school_data, format='json')
        school_id = response.data['school']['id']
        response = self.client.post(f"{self.school_url}{school_id}{self.classroom_url}", self.classroom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['classroom']['name'], self.classroom_data['name'])
        self.assertEqual(response.data['classroom']['class_id'], self.classroom_data['class_id'])

    def test_list_classrooms(self):
        '''
        Test case for listing all classrooms
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        school_id = response.data['school']['id']
        response = self.client.get(f"{self.school_url}{school_id}{self.classroom_url}")
        self.assertEqual(len(response.data), 0)
        response = self.client.post(f"{self.school_url}{school_id}{self.classroom_url}", self.classroom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(f"{self.school_url}{school_id}{self.classroom_url}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_classroom(self):
        '''
        Test case for retrieving a classroom
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        school_id = response.data['school']['id']
        response = self.client.post(f"{self.school_url}{school_id}{self.classroom_url}", self.classroom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(f"{self.school_url}{school_id}{self.classroom_url}{response.data['classroom']['id']}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.classroom_data['name'])
        self.assertEqual(response.data['class_id'], self.classroom_data['class_id'])

    def test_delete_classroom(self):
        '''
        Test case for deleting a classroom
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        school_id = response.data['school']['id']
        response = self.client.post(f"{self.school_url}{school_id}{self.classroom_url}", self.classroom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.delete(f"{self.school_url}{school_id}{self.classroom_url}{response.data['classroom']['id']}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_classroom(self):
        '''
        Test case for updating a classroom
        '''
        self.create_admin()
        response = self.client.post(self.school_url, self.school_data, format='json')
        school_id = response.data['school']['id']
        response = self.client.post(f"{self.school_url}{school_id}{self.classroom_url}", self.classroom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_data = {
            "name": "Test Classroom 2",
            "class_id": "982412",
        }
        response = self.client.patch(f"{self.school_url}{school_id}{self.classroom_url}{response.data['classroom']['id']}/", new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], new_data['name'])
        self.assertEqual(response.data['class_id'], new_data['class_id'])

    
        
