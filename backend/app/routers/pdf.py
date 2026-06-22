import uuid
import time
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from app.services.pdf import PDFService
from app.services.ocr import OCRService

router = APIRouter(prefix="/pdf", tags=["pdf"])

pdf_service = PDFService()
ocr_service = OCRService()

# Cache entries expire after one hour
CACHE_TTL = 60 * 60  # seconds

page_cache: dict[str, dict] = {}

def cleanup_cache():
    now = time.time()

    expired = [
        session_id
        for session_id, entry in page_cache.items()
        if now - entry["created"] > CACHE_TTL
    ]

    for session_id in expired:
        del page_cache[session_id]

@router.post("/translate")
async def translate_pdf(
    file: UploadFile = File(...),
    source_language: str = Form(...),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    
    cleanup_cache()

    pdf_bytes = await file.read()
    pages = pdf_service.extract_pages_as_images(pdf_bytes)

    session_id = str(uuid.uuid4())
    page_cache[session_id] = {
    "pages": pages,
    "created": time.time(),
}

    results = []
    for i, img_bytes in enumerate(pages):
        regions = ocr_service.extract_text_regions(img_bytes, lang=source_language)
        results.append({
            "page": i + 1,
            "regions": [
                {"text": r.text, "x": r.x, "y": r.y, "width": r.width, "height": r.height}
                for r in regions
            ]
        })

    return JSONResponse(content={
        "session_id": session_id,
        "pages": results,
        "total_pages": len(results)
    })