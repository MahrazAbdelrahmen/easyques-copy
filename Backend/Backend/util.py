import re
from enum import Enum
from dotenv import load_dotenv
from elasticsearch_dsl import connections
from elasticsearch import Elasticsearch
import os
from elasticsearch.exceptions import *


class EmailValidator:
    """
    Class to validate email addresses.

    Methods:
    - `is_valid_email(email: str) -> bool`: Check if the given email address is valid.
    """

    @staticmethod
    def is_valid_email(email):
        """
        Validate the given email address.

        Parameters:
        - `email` (str): The email address to validate.

        Returns:
        - `bool`: True if the email is valid, False otherwise.
        """
        email_pattern = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        match = email_pattern.match(email)
        return bool(match)


class PasswordError(Enum):
    """
    Enum representing various password validation errors.

    Attributes:
    - `LENGTH_TOO_SHORT`: Password length is too short.
    - `NO_UPPERCASE`: Password must contain at least one uppercase letter.
    - `NO_LOWERCASE`: Password must contain at least one lowercase letter.
    - `NO_DIGIT`: Password must contain at least one digit.
    - `NO_SPECIAL_CHAR`: Password must contain at least one special character.
    - `COMMON_PATTERN`: Password is a common pattern or easily guessable.
    - `NAME_IN_PASSWORD`: Password cannot contain your first name, last name, or email name.
    """

    LENGTH_TOO_SHORT = "Password length is too short."
    NO_UPPERCASE = "Password must contain at least one uppercase letter."
    NO_LOWERCASE = "Password must contain at least one lowercase letter."
    NO_DIGIT = "Password must contain at least one digit."
    NO_SPECIAL_CHAR = "Password must contain at least one special character."
    COMMON_PATTERN = "Password is a common pattern or easily guessable."
    NAME_IN_PASSWORD = "Password cannot contain your first name, last name, or email name."


class PasswordValidator:
    """
    Class to validate passwords.

    Methods:
    - `validate_password(password: str) -> PasswordError or None`: Validate the given password.
    """

    @staticmethod
    def validate_password(password):
        """
        Validate the given password.

        Parameters:
        - `password` (str): The password to validate.

        Returns:
        - `PasswordError or None`: The validation error if any, else None.
        """
        if len(password) < 12:
            return PasswordError.LENGTH_TOO_SHORT

        if not any(char.isupper() for char in password):
            return PasswordError.NO_UPPERCASE

        if not any(char.islower() for char in password):
            return PasswordError.NO_LOWERCASE

        if not any(char.isdigit() for char in password):
            return PasswordError.NO_DIGIT

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return PasswordError.NO_SPECIAL_CHAR

        return None


class ElasticSearchUtil:
    """
    Utility class for Elasticsearch operations.

    Methods:
    - `__init__()`: Initialize the class with environment variables.
    - `get_elasticsearch_connection()`: Create an Elasticsearch connection.
    - `create_elasticsearch_instance() -> Elasticsearch`: Create an instance of Elasticsearch.

    Attributes:
    - `url` (str): Elasticsearch server URL.
    - `port` (str): Elasticsearch server port.
    - `user_name` (str): Elasticsearch server username.
    - `user_pass` (str): Elasticsearch server password.
    - `article_index` (str): Index name for articles in Elasticsearch.
    """

    def __init__(self):
        """
        Initialize the class with environment variables.
        """
        load_dotenv()

        self.url = os.environ.get('URL')
        self.port = os.environ.get('PORT')
        self.user_name = os.environ.get("USER_NAME")
        self.user_pass = os.environ.get("USER_PASSWORD")
        self.article_index = os.environ.get("ARTICLE_INDEX")

    def get_elasticsearch_connection(self):
        """
        Create an Elasticsearch connection.

        Raises:
        - `ConnectionError`: If there is an issue establishing the connection.
        - `AuthenticationException`: If there is an issue with authentication.
        - `Exception`: For other unexpected errors.
        """
        try:
            connections.create_connection(
                hosts=[f'{self.url}:{self.port}'],
                alias='default',
                verify_certs=False,
                http_auth=(self.user_name, self.user_pass)
            )
        except ConnectionError as ce:
            print(f"ConnectionError: {ce}")
        except AuthenticationException as ae:
            print(f"AuthenticationException: {ae}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

    def create_elasticsearch_instance(self):
        """
        Create an instance of Elasticsearch.

        Returns:
        - `es`: An instance of Elasticsearch.

        Raises:
        - `ConnectionError`: If there is an issue establishing the connection.
        """
        try:
            es = Elasticsearch(verify_certs=False, basic_auth=(self.user_name, self.user_pass),
                               hosts=[f'{self.url}:{self.port}'])
            return es
        except Exception as e:
            raise ConnectionError(f"An unexpected error occurred while creating Elasticsearch instance")
