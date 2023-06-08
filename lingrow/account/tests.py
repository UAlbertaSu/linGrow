from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Parent, Teacher, Researcher, Admin
# Create your tests here.

class AccountTests(APITestCase):
    user_data = {
                    "email": "testnew@parent.com",
                    "first_name": "First",
                    "middle_name": "Middle",
                    "last_name": "Last",
                    "user_type": 1,
                    "password": "Testpassword@123",
                    "password2": "Testpassword@123"
                }
    admin_data = {
                    "email": "testnew@admin.com",
                    "first_name": "First",
                    "middle_name": "Middle",
                    "last_name": "Last",
                    "user_type": 4,
                    "password": "Testpassword@123",
                    "password2": "Testpassword@123"
    }
    child_data = {
        "first_name": "First",
        "last_name": "Last",
        "student_id": "123456",
    }

    login_url = '/api/user/login/'
    register_url = '/api/user/register/'
    profile_url = '/api/user/profile/'
    change_pass_url = '/api/user/changepassword/'
    reset_pass_url = '/api/user/send-reset-password-email/'
    child_parent = '/api/user/child/'
    admin_child_prefix = '/api/user/parent/'
    admin_child_postfix = '/child/'

    def test_registration(self):
        '''
            Test for registration of a user
        '''
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
        '''
            Test for login of a user
        '''
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
        '''
            Test for profile of a user
        '''
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

    def test_change_password(self):
        '''
            Test for changing password of a user
        '''
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
            "password": "Newpassword@123",
            "password2": "Newpassword@123"
        }
        response = self.client.post(self.change_pass_url, data, HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {
            "old_password": self.user_data['password'],
            "password": "Newpassword@123",
            "password2": "Newpassword@123"
        }
        response = self.client.post(self.change_pass_url, data, format='json', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = {
            "email": self.user_data['email'],
            "password": "Newpassword@123"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_email(self):
        '''
            Test for sending password reset email
        '''
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.user_data['email']
        }
        response = self.client.post(self.reset_pass_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_user_patch(self):
        '''
            Test for updating a user
        '''
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
            "first_name": "newfirst",
            "last_name": "newlast",
            "middle_name": "newmiddle",
        }
        response = self.client.patch(self.profile_url, data, format='json', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['user']['first_name'], data['first_name'])
        self.assertEqual(response.json()['user']['last_name'], data['last_name'])
        self.assertEqual(response.json()['user']['middle_name'], data['middle_name'])

    def test_admin_user_listview(self):
        '''
            Test for admin to view all users
        '''
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.register_url, self.admin_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.admin_data['email'],
            "password": self.admin_data['password']
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.json()['token']['access']
        response = self.client.get(self.profile_url+'parents/', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)
        response = self.client.get(self.profile_url+'teachers/', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 0)
        response = self.client.get(self.profile_url+'researchers/', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 0)

    
    def test_admin_user_patch(self):
        '''
            Test for admin to update a user
        '''
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.register_url, self.admin_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.admin_data['email'],
            "password": self.admin_data['password']
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.json()['token']['access']
        data = {
            "first_name": "newfirstname",
            "last_name": "newlastname",
            "middle_name": "newmiddlename",
        }
        response = self.client.get(self.profile_url+'parents/', HTTP_AUTHORIZATION='Bearer ' + token)
        id = response.json()[0]['user']['id']
        response = self.client.patch(self.profile_url+str(id)+'/', data, format='json', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['user']['first_name'], data['first_name'])
        self.assertEqual(response.json()['user']['last_name'], data['last_name'])
        self.assertEqual(response.json()['user']['middle_name'], data['middle_name'])

    def test_add_child(self):
        '''
            Test for adding a child
        '''
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.user_data['email'],
            "password": self.user_data['password']
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.json()['token']['access']
        response = self.client.post(self.child_parent, self.child_data, format='json', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['child']['first_name'], self.child_data['first_name'])
        self.assertEqual(response.json()['child']['last_name'], self.child_data['last_name'])
        self.assertEqual(response.json()['child']['student_id'], self.child_data['student_id'])
        self.assertNotEqual(response.json()['child']['parent'],None)
        response = self.client.delete(self.child_parent+str(response.json()['child']['id'])+'/', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_child_admin(self):
        '''
            Test for admin to add a child
        '''
        response = self.client.post(self.register_url, self.user_data, format='json')
        parent_id = str(response.json()['user']['id'])
        response = self.client.post(self.register_url, self.admin_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "email": self.admin_data['email'],
            "password": self.admin_data['password']
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.json()['token']['access']
        response = self.client.post(self.admin_child_prefix+parent_id+self.admin_child_postfix, self.child_data, format='json', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['child']['first_name'], self.child_data['first_name'])
        self.assertEqual(response.json()['child']['last_name'], self.child_data['last_name'])
        self.assertEqual(response.json()['child']['student_id'], self.child_data['student_id'])
        self.assertNotEqual(response.json()['child']['parent'], parent_id)
        response = self.client.delete(self.admin_child_prefix+parent_id+self.admin_child_postfix+str(response.json()['child']['id'])+'/', HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


