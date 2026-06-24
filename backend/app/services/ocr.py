import os
import pytesseract

import sys

if sys.platform == "win32":
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

print("OCR loaded")
print("Tesseract:", pytesseract.get_tesseract_version())
import cv2
import numpy as np
from app.models.schemas import TextRegion


class OCRService:
    def extract_text_regions(self, image_bytes: bytes, lang: str) -> list[TextRegion]:
        image = self._bytes_to_cv2(image_bytes)
        preprocessed = self._preprocess(image)
        
        tessdata_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "tessdata")
        )
        data = pytesseract.image_to_data(
            preprocessed,
            output_type=pytesseract.Output.DICT,
            config=f"--psm 11 --tessdata-dir {tessdata_dir}",
            lang=lang,
        )

        regions = []
        for i, word in enumerate(data["text"]):
            cleaned_word = word.strip()
            if not cleaned_word:
                continue
            try:
                conf = int(data["conf"][i])
            except (ValueError, TypeError):
                conf = 0
            if conf < 30:
                continue

            # Strip leading/trailing punctuation from the word
            word_text = cleaned_word.strip(",.?!:;()[]{}'\"“”«»`~@#%^&*_-+=/\\<>")
            if not word_text:
                continue

            regions.append(TextRegion(
                block_num=data["block_num"][i],
                text=word_text,
                x=data["left"][i],
                y=data["top"][i],
                width=data["width"][i],
                height=data["height"][i],
            ))

        regions.sort(key=lambda r: (r.y, r.x))
        return regions

    def get_image_dimensions(self, image_bytes: bytes) -> tuple[int, int]:
        img = self._bytes_to_cv2(image_bytes)
        h, w = img.shape[:2]
        return w, h

    def _preprocess(self, image: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray, h=10)
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return thresh

    def _bytes_to_cv2(self, image_bytes: bytes) -> np.ndarray:
        arr = np.frombuffer(image_bytes, np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)