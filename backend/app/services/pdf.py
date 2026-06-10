import fitz  # PyMuPDF

class PDFService:
    def extract_pages_as_images(self, pdf_bytes: bytes) -> list[bytes]:
        """Convert each PDF page into a JPEG image (bytes)."""
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        images = []
        
        for page in doc:
            # Render page to an image (pixmap)
            # Use a matrix for higher resolution if needed
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            img_bytes = pix.tobytes("jpg")
            images.append(img_bytes)
            
        doc.close()
        return images
