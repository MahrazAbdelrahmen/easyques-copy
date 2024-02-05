from django.test import TestCase
from django.test import TestCase, Client
from django.contrib.auth.models import User
from UserPart.models import UserProfile
from rest_framework import status

# un autre test unitaire 
class LoginUserTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='test_user', password='Test_password123&&')
        self.user_profile = UserProfile.objects.create(user=self.user)

        # Create a Django test client
        self.client = Client()

    def test_successful_login(self):
        # Send a valid login request for the specific user
        data = {'username': 'test_user', 'password': 'Test_password123&&'}
        response = self.client.post('/api/login/', data, format='json')

        # Check that the response has a 200 status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the token is present in the response
        self.assertIn('token', response.json())

        # Add more assertions based on your expected response

# Create your tests here.
