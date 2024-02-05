from django.db import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class TokenModerator(models.Model):
    moderator = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=40, unique=True)

    @classmethod
    def generate_token_for_moderator(cls, moderator):
        token, created = cls.objects.get_or_create(moderator=moderator)
        if created:
            token.token = Token.objects.create(user=moderator).key
            token.save()
        return token.token
