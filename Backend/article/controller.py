import json
import logging
from datetime import datetime
from .models import UnPublishedArticle, Author, Institution, Reference, MetaData



class CreateArticleUtil:
    """
            Utility class for creating UnPublishedArticle instances from JSON data or Python objects.

            Methods: - `create_article_from_json(data, article_file)`: Create UnPublishedArticle instance from JSON 
            data. - `create_article_from_object(data, article_file)`: Create UnPublishedArticle instance from Python 
            object. - `_create_meta_data(json_data)`: Create MetaData instance. - `_create_author(author_data)`: 
            Create Author instance. - `_create_institution(institution_data)`: Create Institution instance. - 
            `_create_institution_from_object(institution_data)`: Create Institution instance from Python object. - 
            `_create_reference(reference_data)`: Create Reference instance. - `_create_related_objects(data, key, 
            create_function, add_function)`: Create and add related objects to the UnPublishedArticle instance. - 
            `_create_objects(data_list, create_function, add_function)`: Create and add a list of objects to the 
            UnPublishedArticle instance.

             Example Usage: ```python create_util = CreateArticleUtil() json_data = { 'authors': [{'name': 'Author 
             1', 'affiliations': ['Affiliation 1', 'Affiliation 2']}, {'name': 'Author 2', 'affiliations': [
             'Affiliation 3']}], 'institutions': [{'id': '1', 'label': 'Label 1', 'name': 'Institution 1', 
             'country': 'Country 1' '...', {'id': '2', 'label': 'Label 2', 'name': 'Institution 2', 'country': 
             'Country 2' '...'}], 'references': [{'id': '1', 'year': '2022', 'article_title': 'Reference 1',
             'volume': 'Vol 1', 'pages': '...'}, {'id': '2', 'year': '2021', 'article_title': 'Reference 2', 
             'volume': 'Vol 2', '...'] } article_file = '...' result = create_util.create_article_from_json(
             json_data, article_file) ```
    """
    logger = logging.getLogger(__name__)
    AUTHOR_KEY = 'authors'
    INSTITUTION_KEY = 'institutions'
    REFERENCES_KEY = 'references'

    @staticmethod
    def create_article_from_json(data, article_file):
        """
               Create UnPublishedArticle instance from JSON data.

               Parameters:
               - `data`: JSON data containing information for creating an UnPublishedArticle.
               - `article_file`: Blob data for the UnPublishedArticle.

               Returns:
               - Dictionary with 'success' and 'data' indicating the result of the operation.
        """
        try:
            if not data.get("success", True):
                return data
            meta_data_instance = CreateArticleUtil._create_meta_data(data)
            CreateArticleUtil._create_related_objects(data, CreateArticleUtil.AUTHOR_KEY,
                                                      CreateArticleUtil._create_author, meta_data_instance.authors.add)
            CreateArticleUtil._create_related_objects(data, CreateArticleUtil.INSTITUTION_KEY,
                                                      CreateArticleUtil._create_institution,
                                                      meta_data_instance.institutions.add)
            CreateArticleUtil._create_related_objects(data, CreateArticleUtil.REFERENCES_KEY,
                                                      CreateArticleUtil._create_reference,
                                                      meta_data_instance.references.add)
            article_instance = UnPublishedArticle.objects.create(
                meta_data=meta_data_instance,
                pdf_file=article_file
            )

            article_instance.save()
            return {'success': True, 'message': 'Article created successfully'}

        except KeyError as e:
            print(e)
            CreateArticleUtil.logger.error(f'Missing key in JSON data: {str(e)}')
            return {'success': False, 'message': f'Missing key in JSON data: {str(e)}'}
        except Exception as e:
            print(e)
            CreateArticleUtil.logger.error(f'Error creating article: {str(e)}')
            return {'success': False, 'message': f'Error creating article: {str(e)}'}

    @staticmethod
    def create_article_from_object(data, article_file):
        """
               Create UnPublishedArticle instance from Python object.

               Parameters:
               - `data`: Python object containing information for creating an UnPublishedArticle.
               - `article_file`: Blob data for the UnPublishedArticle.

               Returns:
               - Dictionary with 'success' and 'data' indicating the result of the operation.
        """
        try:
            if not data.get("success", True):
                return data
            meta_data_instance = CreateArticleUtil._create_meta_data(data)
            CreateArticleUtil._create_related_objects(data, CreateArticleUtil.AUTHOR_KEY,
                                                      CreateArticleUtil._create_author, meta_data_instance.authors.add)

            CreateArticleUtil._create_related_objects(data, CreateArticleUtil.INSTITUTION_KEY,
                                                      CreateArticleUtil._create_institution_from_object,
                                                      meta_data_instance.institutions.add)

            CreateArticleUtil._create_related_objects(data, CreateArticleUtil.REFERENCES_KEY,
                                                      CreateArticleUtil._create_reference,
                                                      meta_data_instance.references.add)
            article_instance = UnPublishedArticle.objects.create(
                meta_data=meta_data_instance,
                pdf_file=article_file
            )
            article_instance.save()

            return {'success': True, 'message': 'Article created successfully'}

        except KeyError as e:
            print(e)
            CreateArticleUtil.logger.error(f'Missing key in JSON data: {str(e)}')
            return {'success': False, 'message': f'Missing key in JSON data: {str(e)}'}
        except Exception as e:
            print(e)
            CreateArticleUtil.logger.error(f'Error creating article: {str(e)}')
            return {'success': False, 'message': f'Error creating article: {str(e)}'}

    @staticmethod
    def _create_meta_data(json_data):
        """
               Create METADATA instance

               Parameters:
               - `json_data`: JSON data containing information for creating a MetaData.

               Returns:
               - Instance of MetaData relevant to the input.
        """
        return MetaData.objects.create(
            doi=json_data.get('doi', ''),
            title=json_data.get('title', ''),
            pub_date=datetime.today(),
            abstract=json_data.get('abstract', '')
        )

    @staticmethod
    def _create_author(author_data):
        """
                       Create Author instance from given data.

                       Parameters:
                       - `author_data`: Author Data (Str or Dict) Containing Info about the author

                       Returns:
                       - Instance of Author relevant to the input.
        """
        full_name = author_data

        if isinstance(author_data, dict):
            full_name = author_data.get('name', 'None')

        existing_author = Author.objects.filter(name=full_name).first()
        new_author = Author(name=full_name)

        if existing_author is None:
            new_author.save()

            return {'success': True, 'message': f"Author '{full_name}' added.", 'data': new_author}
        else:
            return {'success': True, 'message': f"Author '{full_name}' already exist.", 'data': existing_author}

    @staticmethod
    def _create_institution(institution_data):
        """
                               Create Institution instance from given data (with a predefined structure).

                               Parameters:
                               - `institution_data`: Institution  Data (Dict) Containing Info about the institution

                               Returns:
                               - Instance of Institution relevant to the input.
                               Note: THIS IS USED AFTER THE EXTRACTION.
        """
        data = json.loads(institution_data)
        existing_institution = Institution.objects.filter(
            department=data.get('college', {}).get('department', 'None'),
            name=data.get('college', {}).get('institution', 'None'),
            address=data.get('college', {}).get('address', 'None'),
            post_code=data.get('college', {}).get('post_code', 'None'),
            country=data.get('college', {}).get('country', 'None')
        ).first()
        new_institution = Institution.objects.create(
            department=data.get('college', {}).get('department', 'None'),
            name=data.get('college', {}).get('name', 'None'),
            address=data.get('college', {}).get('address', 'None'),
            post_code=data.get('college', {}).get('post_code', 'None'),
            country=data.get('college', {}).get('country', 'None')
        )
        if existing_institution is None:
            return {'success': True, 'message': f"institution '{new_institution}' added.", 'data': new_institution}
        else:
            return {'success': True, 'message': f"institution already exist.", 'data': new_institution}

    @staticmethod
    def _create_institution_from_object(institution_data):
        """
                    Create Institution instance from given data.

                    Parameters:
                    - `institution_data`: Institution  Data (Dict) Containing Info about the institution

                    Returns:
                    - Instance of Institution relevant to the input.

                    Note: THIS IS USED IN UPDATING ARTICLES.
        """
        data = institution_data

        existing_institution = Institution.objects.filter(
            department=data.get('department', 'None'),
            name=data.get('institution', 'None'),
            address=data.get('address', 'None'),
            post_code=data.get('post_code', 'None'),
            country=data.get('country', 'None')
        ).first()
        new_institution = Institution.objects.create(
            department=data.get('department', 'None'),
            name=data.get('name', 'None'),
            address=data.get('address', 'None'),
            post_code=data.get('post_code', 'None'),
            country=data.get('country', 'None')
        )
        if existing_institution is None:
            return {'success': True, 'message': f"institution '{new_institution}' added.", 'data': new_institution}
        else:
            return {'success': True, 'message': f"institution already exist.", 'data': new_institution}

    @staticmethod
    def _create_reference(reference_data):
        """
                        Create Reference instance from given data ( relevant to Reference model )

                         Parameters:
                        - `reference_data`: Institution  Data (Dict) Containing Info about the institution

                        Returns:
                        - Instance of Institution relevant to the input.

                        Note: THIS IS USED IN UPDATING ARTICLES.
        """
        existing_reference = Reference.objects.filter(article_title=reference_data['article_title']).first()

        if existing_reference:
            return {'success': True, 'message': f"reference already exist.", 'data': existing_reference}

        reference_instance = Reference.objects.create(
            publication_year=reference_data['published_date'],
            article_title=reference_data['article_title'],
            reference_id=reference_data['reference_id'],
            volume=reference_data['volume'],
            raw_text=reference_data['raw_text']
        )

        for author_data in reference_data['authors']:
            result = CreateArticleUtil._create_author({'name': author_data})
            if result["success"]:
                reference_instance.authors.add(result["data"])

        return {'success': True, 'message': f"Reference Created.", 'data': reference_instance}

    @staticmethod
    def _create_related_objects(data, key, create_function, add_function):
        """
            Create and add related objects to the UnPublishedArticle instance.

            Parameters:
            - `data`: Dictionary containing related objects.
            - `key`: Key to access the related objects in the dictionary.
            - `create_function`: Function to create individual related objects.
            - `add_function`: Function to add the related objects to the UnPublishedArticle instance.
        """
        CreateArticleUtil._create_objects(data[key], create_function, add_function)

    @staticmethod
    def _create_objects(data_list, create_function, add_function):
        """
            Create and add a list of objects to the UnPublishedArticle instance.

            Parameters:
            - `data_list`: List containing objects to be created and added.
            - `create_function`: Function to create individual objects.
            - `add_function`: Function to add the objects to the UnPublishedArticle instance.

        """
        for data in data_list:

            result = create_function(data)
            cont = result["success"]
            data = result["data"]
            if cont:
                add_function(data)
