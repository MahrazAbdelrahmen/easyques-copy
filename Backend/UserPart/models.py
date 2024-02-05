from django.db import models
from django.contrib.auth.models import User
from article.models import Article
from Backend.permissions import USER_PERMISSION


class UserProfile(models.Model):
    """
    Represents a user profile associated with the Django User model.

    This model extends the built-in Django User model with additional information
    such as user favorites and custom permissions.

    Attributes:
        user (User): One-to-one relationship with the Django User model.
        favorites (ManyToManyField): Relationship with Article model for user favorites.
        auth (str): String representing the user authentication type.
        objects (Manager): Default manager for the UserProfile model.

    Permissions:
        - USER_PERMISSION: Custom permission for user-specific actions.

    Example:
    ```python
    # Creating a UserProfile instance for a user
    user_profile = UserProfile.objects.create(user=my_user_instance, favorites=[article1, article2])
    ```

    Relationships:
        - UserProfile has a one-to-one relationship with the Django User model.
        - UserProfile has a many-to-many relationship with the Article model for user favorites.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorites = models.ManyToManyField(Article, related_name='favorited_by', blank=True)
    auth = "USER"
    objects = models.Manager()

    class Meta:
        permissions = [
            (USER_PERMISSION, "user_only_perm"),
        ]

    @property
    def get_user(self):
        """Returns the user"""
        return self.user

    @property
    def get_auth(self):
        return self.auth

    def __str__(self):
        """
        Returns the string representation of the UserProfile instance.

        Example:
        ```python
        user_profile = UserProfile.objects.get(user=my_user_instance)
        print(user_profile)  # Output: "Kazuma Kiryu"
        ```

        Returns:
            str: The user's name associated with the UserProfile.
        """
        return self.user.get_attname()
