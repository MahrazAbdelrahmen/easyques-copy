from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import ObjectDoesNotExist

from .models import Moderator

class ModeratorBackend(ModelBackend):
    """
    Custom authentication backend for moderating users.
    """

    def authenticate(self, request, email=None, password=None, **kwargs):
        """
        Authenticate a moderator based on the provided email and password.

        Parameters:
        - request: Django HTTP request object.
        - email: Email address of the moderator.
        - password: Password provided for authentication.
        - **kwargs: Additional keyword arguments.

        Returns:
        - Moderator object if authentication is successful, None otherwise.
        """
        try:
            moderator = Moderator.objects.get(email=email)
        except ObjectDoesNotExist:
            return None

        if moderator.check_password(password):
            return moderator

    def get_user(self, user_id):
        """
        Retrieve a moderator by user ID.

        Parameters:
        - user_id: User ID of the moderator.

        Returns:
        - Moderator object if found, None otherwise.
        """
        try:
            return Moderator.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return None
