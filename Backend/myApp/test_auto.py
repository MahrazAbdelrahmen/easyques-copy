from io import StringIO
from django.test import RequestFactory
from django.http import JsonResponse
from .views import UploadArticlesView
import os
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
from django.core.files.base import ContentFile
from django.test import RequestFactory
from django.http import JsonResponse
from .views import UploadArticlesView
from .views import UploadArticlesDrive




class UploadArticlesViewTestCase(unittest.TestCase):
# 1ER test unitaire

    def test_download_and_store_pdf(self):
       
        view = UploadArticlesView()

        # URL factice pour le test
        test_url = "https://smallpdf.com/blog/sample-pdf"

        # Crée une fausse requête avec la méthode GET et l'URL spécifiée
        request_factory = RequestFactory()
        request = request_factory.get('/upload/?url=' + test_url)

        # Appelle la méthode download_and_store_pdf avec la fausse requête
        response = view.get(request)

        # la réponse est une instance de JsonResponse et que le message est correct
        self.assertIsInstance(response, JsonResponse)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Upload réussi!')

        # Vérifiez si le fichier PDF a été téléchargé et stocké correctement
        pdfs_directory = 'pdfs'
        pdf_files = os.listdir(pdfs_directory)
        self.assertTrue(pdf_files)

        # Nettoyez le répertoire des PDFs après le test
        for pdf_file in pdf_files:
            os.remove(os.path.join(pdfs_directory, pdf_file))
    
# 2beme test unitaire
 
    def test_search_and_print_results(self):
        # Créer une instance de la classe UploadArticlesView
        view = UploadArticlesView()

        # Rediriger la sortie standard (print) vers une chaîne pour capturer les résultats
        captured_output = StringIO()
        import sys
        sys.stdout = captured_output

        # Appeler la méthode search_and_print_results
        view.search_and_print_results()

        # Réinitialiser la sortie standard
        sys.stdout = sys.__stdout__

        # Capturer la sortie de print
        printed_output = captured_output.getvalue()

        # Vérifier que la sortie de print contient les informations attendues
        self.assertIn("Document ID:", printed_output)
        self.assertIn("Title:", printed_output)

if __name__ == '__main__':
    unittest.main()




# 3eme test unitaire
class UploadArticlesDriveTestCase(unittest.TestCase):
    @patch('myApp.views.build')
    @patch('myApp.views.service_account.Credentials.from_service_account_file')
    def test_get(self, mock_from_service_account_file, mock_build):
        # Créer une instance de la classe UploadArticlesDrive
        view = UploadArticlesDrive()

        # Simuler la requête HTTP
        request_factory = RequestFactory()
        request = request_factory.get('/upload_drive/?url=https://drive.google.com/drive/folders/1V-w9Syn4sNQp41PrdXRG2mShv_SkhOc-?usp=share_link')

        # Simuler les méthodes appelées par la vue
        with patch.object(view, 'download_file', return_value=b'Fake PDF Content') as mock_download_file:
            with patch.object(view, 'get_pdf') as mock_get_pdf:
                # Appeler la méthode get de la vue
                response = view.get(request)

                # Vérifier que la réponse est correcte
                self.assertIsInstance(response, JsonResponse)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()['message'], 'Upload réussi!')

                # Vérifier que les méthodes simulées ont été appelées avec les arguments attendus
                mock_from_service_account_file.assert_called_once_with('Service.json')
                mock_build.assert_called_once_with('drive', 'v3', credentials=mock_from_service_account_file.return_value)
                mock_download_file.assert_called_with(mock_build.return_value, 'fake-file-id')
                mock_get_pdf.assert_called_with('https://drive.google.com/uc?id=fake-file-id')

if __name__ == '__main__':
    unittest.main()
