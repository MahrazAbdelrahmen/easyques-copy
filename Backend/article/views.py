from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, viewsets
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from .controller import CreateArticleUtil
from .models import *
from django.db import transaction
from dotenv import load_dotenv
import os
from .serializers import (
    ReferenceSerializer,
    AuthorSerializer,
    InstitutionSerializer,
    MetaDataSerializer,
    ArticleSerializer,
    UnPublishedArticleSerializer
)
from Backend.permissions import MODS_ADMIN_NO_USER_PERM, MODS_PERMISSION
from rest_framework.response import Response
from rest_framework import status
from elasticsearch_dsl import Q
from Backend.util import ElasticSearchUtil

load_dotenv()
UNPUBLISHED_ARTICLE_INDEX = os.environ.get("UNPUBLISHED_ARTICLE_INDEX")
PUBLISHED_ARTICLE_INDEX = os.environ.get("ARTICLE_INDEX")


class SearchUtil:
    @staticmethod
    def search_articles(request, model_class, field_name, model_class_serial):
        """
        Search for articles based on various criteria such as authors, title, institutions, abstract, and keywords.

        Parameters:
        - request: Django HTTP request object.
        - model_class: The Django model class for articles (e.g., UnPublishedArticle or Article).
        - field_name: The Elasticsearch index name for the specified model_class.
        - model_class_serial: The Django REST Framework serializer class for the specified model_class.

        Returns:
        - Response containing the search results, count, and a message.
        """
        authors = request.GET.get('authors', ' ')
        title = request.GET.get('title', ' ')
        institutions = request.GET.get('institutions', ' ')
        abstract = request.GET.get('abstract', ' ')
        keywords = request.GET.get('keywords', ' ')

        elasticsearch_instance = ElasticSearchUtil()
        es = elasticsearch_instance.create_elasticsearch_instance()

        body = {
            "query": {
                "bool": {
                    "should": [
                        {"match": {"meta_data.title": title}},
                        {"match": {"meta_data.abstract": abstract}},
                        {"match": {"meta_data.authors.name": authors}},
                        {"match": {"meta_data.keywords": keywords}},
                        {"match": {"meta_data.institutions.name": institutions}}
                    ]
                }
            }
        }

        result = es.search(index=field_name, body=body)

        article_ids = []
        non_integer_ids = []

        for hit in result['hits']['hits']:
            try:
                article_id = int(hit['_id'])
                article_ids.append(article_id)
            except ValueError:
                print(f"Failed to convert _id {hit['_id']} to int. Skipping.")
                non_integer_ids.append(hit['_id'])

        articles = model_class.objects.filter(pk__in=article_ids)
        serializer = model_class_serial(articles, many=True)
        articles_count = articles.count()

        if articles_count == 0:
            message = 'No articles found.'
        else:
            message = f'{articles_count} article(s) found for the search.'

        context = {'articles_count': articles_count, 'results': serializer.data, 'message': message}
        return Response(context, status=status.HTTP_200_OK)

    @staticmethod
    def search_un_published_articles(request):
        """
        Search for UnPublishedArticle instances based on the specified criteria.

        Parameters:
        - request: Django HTTP request object.

        Returns:
        - Response containing the search results, count, and a message.
        """
        return SearchUtil.search_articles(request=request, model_class=UnPublishedArticle,
                                          model_class_serial=UnPublishedArticleSerializer,
                                          field_name=UNPUBLISHED_ARTICLE_INDEX)

    @staticmethod
    def search_published_articles(request):
        """
        Search for Article instances based on the specified criteria.

        Parameters:
        - request: Django HTTP request object.

        Returns:
        - Response containing the search results, count, and a message.
        """
        return SearchUtil.search_articles(request=request, model_class=Article,
                                          model_class_serial=ArticleSerializer, field_name=PUBLISHED_ARTICLE_INDEX)


"""
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
"""


class ReferenceListCreateView(PermissionRequiredMixin, generics.ListCreateAPIView):
    permission_required = MODS_ADMIN_NO_USER_PERM
    raise_exception = True
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer


class AuthorListCreateView(PermissionRequiredMixin, generics.ListCreateAPIView):
    permission_required = MODS_ADMIN_NO_USER_PERM
    raise_exception = True
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class InstitutionListCreateView(PermissionRequiredMixin, generics.ListCreateAPIView):
    permission_required = MODS_ADMIN_NO_USER_PERM
    raise_exception = True
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer


class MetaDataListCreateView(PermissionRequiredMixin, generics.ListCreateAPIView):
    permission_required = MODS_ADMIN_NO_USER_PERM
    raise_exception = True
    queryset = MetaData.objects.all()
    serializer_class = MetaDataSerializer


class ArticleListCreateView(generics.ListAPIView):
    raise_exception = True
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class UnPublishedArticleDetailView(viewsets.ModelViewSet):
    queryset = UnPublishedArticle.objects.all()
    serializer_class = UnPublishedArticleSerializer

    @staticmethod
    def validate(request, pk):
        try:
            article = get_object_or_404(UnPublishedArticle, pk=pk)

            new_meta_data = article.get_meta_data()

            with transaction.atomic():
                new_meta_data.id = None
                new_meta_data.save()

                will_be_published_article = Article.objects.create(
                    meta_data=new_meta_data,
                    pdf_file=article.get_pdf_file()
                )

                will_be_published_article.save()
                article.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None, *args):
        try:
            with transaction.atomic():
                article = UnPublishedArticle.objects.get(pk=pk)
                article.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None, *args, **kwargs):
        try:
            with transaction.atomic():
                article = get_object_or_404(UnPublishedArticle, pk=pk)
                data = request.data.get('meta_data', article.get_meta_data())

                CreateArticleUtil.create_article_from_object(data, article.get_pdf_file())
                article.delete()
                return Response(status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def serve_unpublished_article_pdf(request, pk):
        unpublished_article = get_object_or_404(UnPublishedArticle, pk=pk)
        return FileResponse(unpublished_article.get_pdf_file(), as_attachment=True)

    def retrieve(self, request, pk=None, *args):
        paper = get_object_or_404(UnPublishedArticle, pk=pk)
        serializer = self.get_serializer(paper)
        return Response(serializer.data)


class UnPublishedArticleListCreateView(generics.ListAPIView):
    raise_exception = True
    queryset = UnPublishedArticle.objects.all()
    serializer_class = UnPublishedArticleSerializer


class ArticleManager(PermissionRequiredMixin, viewsets.ModelViewSet):
    permission_required = MODS_PERMISSION
    raise_exception = True
    queryset = UnPublishedArticle.objects.all()
    serializer_class = UnPublishedArticleSerializer

    @staticmethod
    def get_articles(request):
        elasticsearch_instance = ElasticSearchUtil()
        elasticsearch_instance.get_elasticsearch_connection()
        q = request.GET.get('q') if request.GET.get('q') is not None else ''
        articles = Article.objects.filter(Q(meta_data__tilte__icontains=q))
        articles_count = articles.count()
        serializer = ArticleSerializer(articles, many=True)
        context = {'articles': serializer.data,
                   'articles_count': articles_count
                   }

        if articles_count == 0:
            message = 'Aucun article trouvé.'
        else:
            message = f'{articles_count} article(s) trouvé(s) pour la recherche "{q}".'

        context['message'] = message
        return Response(context, status=200)

    @staticmethod
    def destroy(request, pk=None, *args):
        try:
            article = UnPublishedArticle.objects.get(pk=pk)
            article.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None, *args):
        try:
            article = UnPublishedArticle.objects.get(pk=pk)
            serializer = UnPublishedArticleSerializer(article, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print(serializer.errors)  #
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
