import re
from enum import Enum
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Moderator


class TokenModerator:
    """
    Utility class for generating tokens for moderators.

    Methods:
        - generate_token_for_moderator(moderator_email): Generates an access token for the specified moderator.

    Inheritance:
        - This class does not inherit.

    Relationships:
        - Uses the `Moderator` model for token generation.
    """

    @staticmethod
    def generate_token_for_moderator(moderator_email):
        """
        Generates a token for the specified moderator.

        Parameters:
            - moderator_email (str): Email of the moderator for whom the token is generated.

        Returns:
            - str: Access token as a string.
        """
        try:
            moderator = Moderator.objects.get(email=moderator_email)
            refresh = RefreshToken.for_user(moderator)
            return str(refresh.access_token)
        except Moderator.DoesNotExist:
            return None  # Handling the case where the moderator doesn't exist
