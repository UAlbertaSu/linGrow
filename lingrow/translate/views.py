from google.cloud import translate
from google.protobuf.json_format import MessageToJson
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
def translate_text(text, target_language, project_id="lingrow-testing-api"):

    if (target_language == "en"):
        return text

    client = translate.TranslationServiceClient()
    location = "global"
    parent = f"projects/{project_id}/locations/{location}"

    response = client.translate_text(
        request={
            "parent": parent,
            "contents": [text],
            "mime_type": "text/plain",
            "source_language_code": "en-US",
            "target_language_code": target_language,
        }
    )

    result = []

    for translation in response.translations:
        result.append(translation.translated_text)

    return result

class TranslationView(APIView):
    '''
        View to retrieve translation information from the google cloud
    '''

    def post(self, request, *args, **kwargs):
        '''
            View for getting the translation request
        '''
        user_request = request.data
        text = user_request['Text']
        target = user_request['Target']
        return Response(translate_text(text, target))
