from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from article.serializers import *
from django.db import transaction
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from UserPart.models import UserProfile
from moderator.util import TokenModerator
from moderator.models import Moderator
from myApp.models import Admin


class ModelDataReturn:
    """
    A utility class for returning user data in a standardized format.
    """

    @staticmethod
    @api_view(['GET'])
    @authentication_classes([TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def get_data(request):
        """
        API endpoint to retrieve user data.

        Parameters:
        - request: The HTTP request.

        Returns:
        - Response: A response containing user data or an error message.
        """
        user = request.user
        try:

            user_profile = Admin.objects.get(user__username=user)

            context = {
                'first_name': user_profile.user.first_name,
                'last_name': user_profile.user.last_name,
                'email': user_profile.user.username,
                'type': "USER"
            }
            print("hhh")
            return Response(context, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:

            pass

        try:

            user_profile = UserProfile.objects.get(user__username=user)

            context = {
                'first_name': user_profile.user.first_name,
                'last_name': user_profile.user.last_name,
                'email': user_profile.user.username,
                'type': "USER"
            }
            print("hhh")
            return Response(context, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:

            pass

        try:
            moderator_profile = Moderator.objects.get(email=user)
            context = {
                'first_name': moderator_profile.get_first_name(),
                'last_name': moderator_profile.get_last_name(),
                'email': moderator_profile.get_email(),
            }
            return Response(context, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'User profile not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_user_type(request):
    user = request.user
    try:
        user_profile = Admin.objects.get(user__email=user)
        if user_profile:
            return Response({'value': 3})
    except ObjectDoesNotExist:
        pass

    try:
        user_profile = UserProfile.objects.get(user__email=user)
        if user_profile:
            return Response({'value': 1})
    except ObjectDoesNotExist:
        pass

    try:
        user_profile = Moderator.objects.get(email=user)
        if user_profile:
            return Response({'value': 2})
    except ObjectDoesNotExist:
        pass


@api_view(['POST'])
@csrf_protect
@csrf_exempt
def login_user(request):
    """
    Log in a user or moderator and return an authentication token.

    This function authenticates a user or moderator based on the provided
    username (or email) and password. It returns an authentication token
    upon successful login.

    Args:
        request (Request): The Django request object containing user credentials.

    Returns:
        Response: A JSON response containing the authentication result and token.

    Raises:
        None

    Example:
    ```python
    # Sample request data
    request_data = {'username': 'john_doe', 'password': 'secret_password'}
    response = login_user(request_data)
    print(response.data)
    ```

    Response Example: ```json {'message': 'Login successful', 'type': 'user', 'token': 'generated_token',
    'first_name': 'John', 'last_name': 'Doe'} ```

    Status Codes:
        - 200: Successful login
        - 400: Bad request (missing username or password)
        - 401: Unauthorized (incorrect username, password, or both)
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Both username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    user = None
    user_type = None
    try:

        UserProfile.objects.get(user__username=username)
        user = authenticate(request, username=username, password=password)
        user_type = 'user'

    except ObjectDoesNotExist:

        try:
            user_profile = Moderator.objects.get(email=username)
           
            if user_profile is not None:
                user = authenticate(request, email=username, password=password)
                user_type = 'moderator'

        except ObjectDoesNotExist:
            try:

                user_profile = Admin.objects.get(user__username=username)
                if user_profile is not None:
                    user = authenticate(request, username=username, password=password)
                    user_type = 'admin'
            except ObjectDoesNotExist:
                return Response({'error': 'Incorrect username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
    token = ' '
    if user is not None:
        login(request, user)

        # Generate or retrieve the user's token
        if user_type == 'user':

            token, created = Token.objects.get_or_create(user=user)
            token = str(token.key)
        elif user_type == 'moderator':
            token = TokenModerator.generate_token_for_moderator(moderator_email=username)
        elif user_type == 'admin':
            token, created = Token.objects.get_or_create(user=user)

        # Include the token in the response
        first_name = user.first_name
        last_name = user.last_name
        message = "Login successful"

        return Response({'message': message, 'type': user_type,
                         'token': str(token), 'first_name': first_name,
                         'last_name': last_name}, status=status.HTTP_200_OK)
    else:
        message = "Incorrect password"
        return Response({'error': message}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request):
    print(request)
    try:
        logout(request)
    except Exception as e:
        print(e)

    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_user_type(request):
    user = request.user

    try:
        Admin.objects.get(user__username=user)
        return Response({'value': 3})
    except ObjectDoesNotExist:
        pass

    try:
        UserProfile.objects.get(user__username=user)
        return Response({'value': 1})
    except ObjectDoesNotExist:
        pass

    try:
        Moderator.objects.get(email=user)
        return Response({'value': 2})
    except ObjectDoesNotExist:
        pass

    return Response({'value': 0})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_username(request):
    new_username = request.data.get('new_username')

    if not new_username:
        return Response({'message': 'New username is required'}, status=400)

    user_profile = request.user.userprofile

    with transaction.atomic():
        # Ensure atomicity for database operations
        if User.objects.exclude(id=user_profile.id).filter(username=new_username).exists():
            return Response({'message': 'Username already exists for another user'}, status=400)

        user_profile.user.username = new_username
        user_profile.user.save()

    return Response({'message': 'Username updated successfully'}, status=200)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_password(request):
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({'message': 'Current password and new password are required'}, status=400)

    user_profile = request.user.userprofile

    if not check_password(current_password, user_profile.user.password):
        return Response({'message': 'Incorrect current password'}, status=400)

    user_profile.user.set_password(new_password)
    user_profile.user.save()

    update_session_auth_hash(request, user_profile)

    return Response({'message': 'Password updated successfully'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    password = request.data.get('password')

    if not first_name or not last_name or not email or not password:
        return Response({'error': 'All fields are required'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'User with this email already exists'}, status=400)
    user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name,
                                    last_name=last_name)
    user = UserProfile.objects.create(user=user)
    print(user)
    user.save()

    return Response({'message': 'User registered successfully'}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user_favorites(request):
    try:
        user_profile = request.user.userprofile
        print(request.user.userprofile)
    except ObjectDoesNotExist:
        return Response({'message': 'UserProfile not found'}, status=404)

    favorites_list = user_profile.favorites.all()
    print(favorites_list)
    serializer = ArticleSerializer(favorites_list, many=True)

    return Response({'favorites': serializer.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_to_favorites(request, article_id):
    user_profile = request.user.userprofile

    article = get_object_or_404(Article, id=article_id)

    user_profile.favorites.add(article)

    favorites_list = user_profile.favorites.all()

    serializer = ArticleSerializer(favorites_list, many=True)

    return Response({'favorites': serializer.data, 'message': f'Article with ID {article_id} added to favorites'},
                    status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def remove_favorite(request, article_id):
    try:
        user_profile = request.user.userprofile
    except ObjectDoesNotExist:
        return Response({'message': 'UserProfile not found'}, status=404)

    article = get_object_or_404(Article, id=article_id)

    user_profile.favorites.remove(article)
    print(f'Article with ID {article_id} removed from favorites by user {request.user.username}')

    favorites_list = user_profile.favorites.all()
    print(favorites_list)
    serializer = ArticleSerializer(favorites_list, many=True)

    return Response({'favorites': serializer.data, 'message': f'Article with ID {article_id} removed from favorites'},
                    status=200)
