import deepl
from dotenv import load_dotenv
from routers import pdf, translate
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "services", "keys.env"))
class TranslationService:
    def __init__(self, api_key: str):
        self.translator = deepl.Translator(api_key)

    def translate(self, text: str, target_language: str) -> str:
        if text.strip() == "[No text found]":
            return text
        return self.translator.translate_text(text, target_lang=target_language).text