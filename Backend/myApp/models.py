from django.contrib.auth.models import User
from django.db import models
from Backend.permissions import ADMIN_PERMISSION


class Admin(models.Model):
    """Represents an administrator user with additional fields."""

    auth = "ADMIN"
    objects = models.Manager()

    class Meta:
        permissions = [
            (ADMIN_PERMISSION, "admin_only_perm"),
        ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        unique=True,
    )
