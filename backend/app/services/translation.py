import deepl

class TranslationService:
    def __init__(self, api_key: str):
        self.translator = deepl.Translator(api_key)

    def translate(self, text: str, target_language: str) -> str:
        if text.strip() == "[No text found]":
            return text
        return self.translator.translate_text(text, target_lang=target_language).text