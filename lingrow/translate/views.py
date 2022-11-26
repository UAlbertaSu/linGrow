from google.cloud import translate
from requests_cache import CachedSession

from rest_framework.views import APIView
from rest_framework.response import Response


def get_supported_languages_with_target(project_id="lingrow-testing-api"):
    '''
        Listing supported languages with target language name.
    '''
    session = CachedSession()

    API_key = 'AIzaSyC1UIimGmDHQfFesxsum3ifUObJuQo-W6U'
    url = f"https://translation.googleapis.com/language/translate/v2/languages"

    response = session.get(url, params={'key': API_key, 'target': 'en'})
    print(type(response.json()))
    return response.json()

# def translate_text(text, source_language, target_language, project_id="lingrow-testing-api", glossary_id="lingrow_glossary"):
#     '''
#         Translate a string into target language, given source language.
#     '''

#     # If the target and source language is same, return the query text as is
#     if (target_language == source_language):
#         return text

#     client = translate.TranslationServiceClient()
#     location = "global"
#     parent = f"projects/{project_id}/locations/{location}"

#     # glossary = client.glossary_path(
#     #     project_id, "us-central1", glossary_id  # The location of the glossary
#     # )
#     # glossary_config = translate.TranslateTextGlossaryConfig(glossary=glossary)

#     response = client.translate_text(
#         request={
#             "parent": parent,
#             "contents": [text],
#             "mime_type": "text/plain",
#             "source_language_code": "en",
#             "target_language_code": target_language,
#             # "glossary_config": glossary_config,
#         }
#     )

#     return response.translations[0].translated_text

def translate_text(text, source_language, target_language):
    session = CachedSession()

    if (target_language == source_language):
        return text

    API_key = 'AIzaSyC1UIimGmDHQfFesxsum3ifUObJuQo-W6U'
    url = f"https://translation.googleapis.com/language/translate/v2"
    
    response = session.post(url, params={'key': API_key, 'target': target_language, 'source': source_language, 'q': text, 'format': 'text'})
    return response.json()['data']['translations'][0]['translatedText']

class TranslationView(APIView):
    '''
        View to retrieve translation information from the google cloud
    '''
    def get(self, request, *args, **kwargs):
        '''
            View for getting the translation request
        '''
        return Response(get_supported_languages_with_target())

    def post(self, request, *args, **kwargs):
        '''
            View for getting the translation request
        '''
        user_request = request.data
        text = user_request['Text']
        target = user_request['Target']
        source = user_request['Source']
        return Response(translate_text(text, source, target))
