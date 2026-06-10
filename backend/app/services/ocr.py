import pytesseract
import cv2
import numpy as np
from models.schemas import TextRegion


class OCRService:
    def extract_text_regions(self, image_bytes: bytes) -> list[TextRegion]:
        image = self._bytes_to_cv2(image_bytes)
        preprocessed = self._preprocess(image)
        data = pytesseract.image_to_data(
            preprocessed,
            output_type=pytesseract.Output.DICT,
            config="--psm 11"
        )
        return self._group_by_block(data)

    def get_image_dimensions(self, image_bytes: bytes) -> tuple[int, int]:
        img = self._bytes_to_cv2(image_bytes)
        h, w = img.shape[:2]
        return w, h

    def _group_by_block(self, data: dict) -> list[TextRegion]:
        blocks: dict[int, dict] = {}

        for i, word in enumerate(data["text"]):
            if not word.strip():
                continue
            conf = int(data["conf"][i])
            if conf < 30:
                continue

            block_num = data["block_num"][i]
            if block_num not in blocks:
                blocks[block_num] = {
                    "words": [],
                    "x": data["left"][i],
                    "y": data["top"][i],
                    "x2": data["left"][i] + data["width"][i],
                    "y2": data["top"][i] + data["height"][i],
                }
            else:
                blocks[block_num]["x"] = min(blocks[block_num]["x"], data["left"][i])
                blocks[block_num]["y"] = min(blocks[block_num]["y"], data["top"][i])
                blocks[block_num]["x2"] = max(blocks[block_num]["x2"], data["left"][i] + data["width"][i])
                blocks[block_num]["y2"] = max(blocks[block_num]["y2"], data["top"][i] + data["height"][i])
            blocks[block_num]["words"].append(word)

        regions = []
        for block_num, block in blocks.items():
            text = " ".join(block["words"]).strip()
            if text:
                regions.append(TextRegion(
                    block_num=block_num,
                    text=text,
                    x=block["x"],
                    y=block["y"],
                    width=block["x2"] - block["x"],
                    height=block["y2"] - block["y"],
                ))

        regions.sort(key=lambda r: (r.y, r.x))
        return regions

    def _preprocess(self, image: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray, h=10)
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return thresh

    def _bytes_to_cv2(self, image_bytes: bytes) -> np.ndarray:
        arr = np.frombuffer(image_bytes, np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)