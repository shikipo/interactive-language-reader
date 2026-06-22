from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.services.ocr import OCRService
from app.services.translation import TranslationService
from app.models.schemas import HoverRequest
from app.routers.pdf import page_cache
import os
import time

router = APIRouter(prefix="/translate", tags=["translate"])
ocr_service = OCRService()
translation_service = TranslationService(api_key=os.getenv("DEEPL_API_KEY"))

# Cache OCR results per page so we don't re-run on every hover
ocr_cache: dict[str, dict] = {}

def cleanup_ocr_cache():
    now = time.time()

    expired = [
        session_id
        for session_id, entry in ocr_cache.items()
        if now - entry["created"] > 60 * 60
    ]

    for session_id in expired:
        del ocr_cache[session_id]


@router.post("/hover")
async def hover_translate(req: HoverRequest):
    """Given a session, page, and hover coordinates, return the translated bubble."""

    cleanup_ocr_cache()
    
    entry = page_cache.get(req.session_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Session not found.")

    pages = entry["pages"]

    img_bytes = pages[req.page_number - 1]
    # Run OCR once per page, cache the result
    if req.session_id not in ocr_cache:
        ocr_cache[req.session_id] = {
            "created": time.time(),
            "pages": {}
        }

    if req.page_number not in ocr_cache[req.session_id]["pages"]:
        ocr_cache[req.session_id]["pages"][req.page_number] = (
            ocr_service.extract_text_regions(
                img_bytes,
                lang=req.source_language,
            )
        )

    regions = ocr_cache[req.session_id]["pages"][req.page_number]

    # Find which bubble the user is hovering over
    img_width, img_height = ocr_service.get_image_dimensions(img_bytes)
    matched = next(
        (r for r in regions if r.contains(req.x, req.y, img_width, img_height)),
        None,
    )

    if not matched:
        return JSONResponse(content={"matched": False})

    translated = translation_service.translate(
        matched.text,
        req.target_language,
    )

    return JSONResponse(
        content={
            "matched": True,
            "original": matched.text,
            "translated": translated,
            "region": {
                "x": matched.x,
                "y": matched.y,
                "width": matched.width,
                "height": matched.height,
            },
        }
    )