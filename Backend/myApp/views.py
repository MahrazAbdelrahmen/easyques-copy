import os
from datetime import datetime
from io import BytesIO
from urllib.parse import unquote
import re
import requests
from article.documents import ArticleDocument
from article.extraction.extraction import PdfController
from django.core.files import File
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.views import View
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from Backend.util import ElasticSearchUtil
from .exceptions import FileDoesNotExist
from article.filters.filters import AuthorsFilter

# Define the list of fields in the request data JSON
request_data_json = ['first_name', 'last_name', 'email', 'password']


class UploadArticlesView(View):
    """
    View for uploading articles.

    Methods:
        - download_and_store_pdf(url): Downloads and stores a PDF file.
        - search_and_print_results(): Searches and prints results from Elasticsearch.
        - get(request): Handles the HTTP GET request for uploading articles.

    Inheritance:
        - This class inherits from Django's `View`.

    Relationships:
        - Utilizes `ElasticSearchUtil`, `PdfController`, `ArticleDocument`, and `AuthorsFilter`.
    """

    @staticmethod
    def download_and_store_pdf(url):
        """
                Downloads and Stores a PDF file.

                Parameters:
                    - url: The URL of the PDF file.

                Returns:
                    - json_data: JSON data processed from the PDF file.
        """
        try:
            response = requests.get(url)

            pdfs_directory = 'pdfs'
            if not os.path.exists(pdfs_directory):
                os.makedirs(pdfs_directory)

            pdf_path = os.path.join(pdfs_directory, f"article_{datetime.now()}_{1}.pdf")

            with open(pdf_path, 'wb') as pdf_file:
                pdf_file.write(response.content)

            content_file = ContentFile(response.content)
            pdf_file = File(content_file, name=f"article_{datetime.now()}_{1}.pdf")
            print('process_and_store_pdf')
            json_data = PdfController.process_and_store_pdf(pdf_path, pdf_file)

            return json_data

        except Exception as e:
            raise Exception(f"Error downloading and storing PDF: {str(e)}")

    @staticmethod
    def search_and_print_results():
        """
            Searches and prints results from Elasticsearch.
            
            Note : This was meant to test the article filters classes, should be removed later.
        """
        search_term = 'Daniel Levinson'

        author_name_filter = AuthorsFilter()

        base_search = ArticleDocument.search()

        filtered_search = author_name_filter.filter(base_search, [search_term])

        search_results = filtered_search.execute()

        for hit in search_results:
            print("Document ID:", hit.meta.id)
            print("Title:", hit.meta_data.title)

    def get(self, request):
        """
            Handles the HTTP GET request for uploading articles.

            Parameters:
                - request: The HTTP request.

            Returns:
                - JsonResponse: The HTTP response.
        """
        try:
            elasticsearch_instance = ElasticSearchUtil()
            elasticsearch_instance.get_elasticsearch_connection()

            url = request.GET.get('url')

            self.download_and_store_pdf(url)

            self.search_and_print_results()

            return JsonResponse({'message': 'Upload réussi!'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    def get_pdf(self, url):
        """
            Handles the HTTP GET request for uploading articles from a PDF file.

            Parameters:
                - url: The URL of the PDF file.

            Returns:
                - JsonResponse: The HTTP response.
        """
        try:
            elasticsearch_instance = ElasticSearchUtil()
            elasticsearch_instance.get_elasticsearch_connection()

            self.download_and_store_pdf(url)

            return JsonResponse({'message': 'Upload réussi!'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class UploadArticlesDrive(View):
    """
        View for uploading articles from Google Drive.

        Methods:
            - get(request): Handles the HTTP GET request for uploading articles from Google Drive.
            - download_file(drive_service, file_id): Downloads a file from Google Drive.

        Inheritance:
            - This class inherits from Django's `View`.

        Relationships:
            - Utilizes `UploadArticlesView`, `service_account`, and `MediaIoBaseDownload`.
    """

    def get(self, request):
        encoded_url = request.GET.get('url')

        try:
            # Decode the URL
            drive_folder_url = unquote(encoded_url)

            # Authenticate using your service account key
            credentials = service_account.Credentials.from_service_account_file('Service.json')

            # Build the Google Drive API service
            drive_service = build('drive', 'v3', credentials=credentials)

            # Extract folder ID from the folder URL using regex

            match = re.search(r'/drive/folders/(.*?)(?:\?|$)', drive_folder_url)

            if not match:
                raise FileDoesNotExist("Invalid Google Drive folder URL")

            folder_id = match.group(1)

            # Get files in the folder
            files = drive_service.files().list(q=f"'{folder_id}' in parents").execute().get('files', [])

            if not files:
                raise FileDoesNotExist("No files found in the Google Drive folder")

            # Download and store each PDF file in the Article model
            uploader = UploadArticlesView()
            for i, file in enumerate(files, start=1):
                print(f"Downloading PDF file {i}")
                self.download_file(drive_service, file['id'])

                pdf_url = f"https://drive.google.com/uc?id={file['id']}"
                print(pdf_url)
                # Store the file content in the Article model
                uploader.get_pdf(pdf_url)

                print(f"PDF file {i} downloaded")

            return JsonResponse({'message': 'Upload réussi!'})

        except Exception as e:
            print("Error:", e)
            return JsonResponse({'error': str(e)}, status=400)

    def download_file(self, drive_service, file_id):
        """
            Downloads a file from Google Drive.

            Args:
                - drive_service: The Google Drive API service.
                - file_id: The ID of the file to be downloaded.

            Returns:
                - file_content: The content of the downloaded file.
        """
        request = drive_service.files().get_media(fileId=file_id)
        file_content = BytesIO()
        downloader = MediaIoBaseDownload(file_content, request)
        done = False

        while not done:
            status, done = downloader.next_chunk()

        return file_content.getvalue()
