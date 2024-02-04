from rest_framework import serializers
from .models import *


class ReferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for Reference model.

    Attributes:
    - `model`: Reference
    - `fields`: All fields of the Reference model.
    """

    class Meta:
        model = Reference
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Author model.

    Attributes:
    - `model`: Author
    - `fields`: All fields of the Author model.
    """

    class Meta:
        model = Author
        fields = '__all__'


class InstitutionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Institution model.

    Attributes:
    - `model`: Institution
    - `fields`: All fields of the Institution model.
    """

    class Meta:
        model = Institution
        fields = '__all__'


class MetaDataSerializer(serializers.ModelSerializer):
    """
    Serializer for the MetaData model.

    Attributes:
    - `model`: MetaData
    - `fields`: All fields of the MetaData model.
    - `authors`: AuthorSerializer (nested serializer for authors)
    - `institutions`: InstitutionSerializer (nested serializer for institutions)
    - `references`: ReferenceSerializer (nested serializer for references)
    """

    authors = AuthorSerializer(many=True)
    institutions = InstitutionSerializer(many=True)
    references = ReferenceSerializer(many=True)

    class Meta:
        model = MetaData
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for the Article model.

    Attributes:
    - `model`: Article
    - `fields`: All fields of the Article model.
    - `meta_data`: MetaDataSerializer (nested serializer for meta_data)
    """

    meta_data = MetaDataSerializer()

    class Meta:
        model = Article
        fields = '__all__'


class UnPublishedArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for the UnPublishedArticle model.

    Attributes:
    - `model`: UnPublishedArticle
    - `fields`: All fields of the UnPublishedArticle model.
    - `meta_data`: MetaDataSerializer (nested serializer for meta_data)
    """

    meta_data = MetaDataSerializer()

    class Meta:
        model = UnPublishedArticle
        fields = '__all__'
