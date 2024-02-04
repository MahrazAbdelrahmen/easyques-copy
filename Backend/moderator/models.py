import uuid
from django.contrib.auth.hashers import make_password, get_random_string
from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from Backend.permissions import MODS_ADMIN_NO_USER_PERM, MODS_PERMISSION


class Moderator(AbstractBaseUser):
    """
    Represents a Moderator in the system.

    Methods:
        - __str__(self): Returns the string value of an instance of a moderator.

    Inheritance:
        - This class inherits from Django's `AbstractBaseUser` class.

    Relationships:
        - No direct relationships with other models.
    """

    first_name = models.CharField(max_length=255, default="mod")
    last_name = models.CharField(max_length=255, default="mod")
    email = models.EmailField(unique=True, default="abc@abc.com")
    mod_id = models.UUIDField(default=ModAttributesUtil.generate_unique_mod_id, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=255, default=ModAttributesUtil.password)
    objects = models.Manager()
    auth = "MODERATOR"
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'password']

    class Meta:
        permissions = [
            (MODS_PERMISSION, "mod_only_perm"),
            (MODS_ADMIN_NO_USER_PERM, "mod_admin_only"),
        ]

    def __str__(self):
        return self.email
