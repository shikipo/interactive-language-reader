from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from services.pdf import PDFService
from services.ocr import OCRService

router = APIRouter(prefix="/pdf", tags=["pdf"])

pdf_service = PDFService()
ocr_service = OCRService()


@router.post("/translate")
async def translate_pdf(
    file: UploadFile = File(...),
    target_language: str = Form(default="EN-US"),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    pdf_bytes = await file.read()
    pages = pdf_service.extract_pages_as_images(pdf_bytes)

    results = []
    for i, img_bytes in enumerate(pages):
        regions = ocr_service.extract_text_regions(img_bytes)
        results.append({
            "page": i + 1,
            "regions": [
                {"text": r.text, "x": r.x, "y": r.y, "width": r.width, "height": r.height}
                for r in regions
            ]
        })

    return JSONResponse(content={"pages": results, "total_pages": len(results)})