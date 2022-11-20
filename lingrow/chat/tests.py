from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Message
# Create your tests here.
class ChatTests(APITestCase):
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
    login_url = '/api/user/login/'
    private_chat_url = '/api/chat/private_chat/'
    create_chat_url='/api/chat/create_chat/'
    message_send_url='/api/chat/send_message/'
    chat_list_url = '/api/user/profile/'
    new_chat_url = '/api/user/new_chat/'
    create_chat_url = '/api/user/create_chat/'
    group_chat_url = '/api/user/group_chat/'


    def test_direct_chat(self):
        '''
            Test sending a message to a user
        '''
        response = self.client.post(self.chat_url, self.user_data, format='json')
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


    def test_group_chat(self):
        '''
            Test sending a message to a group
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