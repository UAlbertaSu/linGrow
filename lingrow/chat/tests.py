from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Message

class ChatTests(APITestCase):
    user_data = {
                    "email": "testuser1@email.com",
                    "first_name": "First",
                    "last_name": "Last",
                    "user_type": 4,
                    "password": "Test@1234",
                    "password2": "Test@1234"
                }
    admin_data = {
                    "email": "testnew@admin.com",
                    "first_name": "First",
                    "last_name": "Last",
                    "user_type": 4,
                    "password": "Testpassword@123",
                    "password2": "Testpassword@123"
    }
    login_url = '/api/user/login/'
    private_chat_url = '/api/chat/private_chat/'
    create_chat_url='/api/chat/create_chat/'
    message_send_url='/api/chat/send_message/'
    chat_list_url = '/api/chat/profile/'
    new_chat_url = '/api/chat/new_chat/'
    get_messages = '/api/chat/get_private_chat_messages/'

    def create_admin(self,user_data):
        '''
        Helper function to create an admin user
        '''
        response = self.client.post('/api/user/register/', user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response.json()['token']['access']
        # self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.json()['token']['access'])

    def test_chat(self):
        '''
        Test case for creating a chat
        '''
        admin1_token = self.create_admin(self.admin_data)
        admin2_token = self.create_admin(self.user_data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + admin1_token)
        response = self.client.get(self.chat_list_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['private_chats'], [])
        self.assertEqual(response.data['len_chats'],0)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + admin2_token)
        response = self.client.get(self.chat_list_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['private_chats'], [])
        self.assertEqual(response.data['len_chats'],0)
        
        response = self.client.get(self.new_chat_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        self.assertEqual(len(response.data), 2)

        response = self.client.post(self.create_chat_url, {'other_username': self.admin_data['email']}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_chat'], 1)
        self.assertEqual(len(response.data['messages']), 0)

        response = self.client.post(self.message_send_url, {'id_chat': 1, 'message': 'Hello'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message']['text'], 'Hello')

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + admin1_token)
        response = self.client.get(self.chat_list_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['private_chats']), 1)
        self.assertEqual(response.data['len_chats'],1)

        response = self.client.post(self.get_messages, {'id_chat': 1, 'lang': 'en'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text'], 'Hello')
        self.assertEqual(response.data[0]['username'], self.user_data['email'])