import concurrent.futures
from article.extraction.extraction import PdfExtractionUtil, PdfController


class ConcurrentPdfExtractUtil:
    """
    Utility class for concurrent PDF text extraction.

    Attributes:
    - `pdf_extractor`: PdfController instance for PDF processing.

    Methods:
    - `__init__(self)`: Constructor to initialize PdfController.
    - `extract_text_from_pdfs(self, pdf_urls)`: Extract text from multiple PDFs concurrently.
    - `extract_text_from_pdf(self, pdf_url)`: Extract text from a single PDF.

    Example Usage:
    ```python
    concurrent_pdf_extractor = ConcurrentPdfExtractUtil()
    pdf_urls = ["https://ils.unc.edu/courses/2020_fall/inls558_001/adultdevelopment.pdf" ....]
    results = concurrent_pdf_extractor.extract_text_from_pdfs(pdf_urls)
    ```

    Note: This is a test and won't be published.
    """

    def __init__(self):
        """
        Constructor to initialize PdfController.
        """
        self.pdf_extractor = PdfController()

    def extract_text_from_pdfs(self, pdf_urls):
        """
        Extract text from multiple PDFs concurrently.

        Parameters:
        - `pdf_urls`: List of URLs pointing to PDF files.

        Returns:
        - List of results from concurrent extraction.
        """
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(self.extract_text_from_pdf, pdf_urls))
        return results

    def extract_text_from_pdf(self, pdf_url):
        """
        Extract text from a single PDF.

        Parameters:
        - `pdf_url`: URL pointing to the PDF file.

        Returns:
        - None
        """
        try:
            self.pdf_extractor.process_and_store_pdf(pdf_url)
        except Exception as e:
            print('Error:', e)
