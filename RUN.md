# Running LinguaPDF

Follow these instructions to get both the backend and frontend running.

## Prerequisites

- **Tesseract OCR**: Required for text extraction.
  - **Linux**: `sudo apt install tesseract-ocr`
  - **macOS**: `brew install tesseract`
  - **Windows**: Install from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki).
- **Node.js & pnpm**: Required for the frontend.
- **Python 3.10+**: Required for the backend.

---

## 1. Backend Setup (FastAPI)

Open a terminal and navigate to the `backend` directory:

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate (Bash/Zsh)
source venv/bin/activate
# Activate (Fish)
source venv/bin/activate.fish
# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn python-multipart pytesseract opencv-python numpy deepl python-dotenv pymupdf

# Run the server from the app directory
cd app
uvicorn main:app --reload
```

The backend will be running at `http://127.0.0.1:8000`.

---

## 2. Frontend Setup (React + Vite)

Open a **separate** terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install dependencies
pnpm install

# (First time only) Approve build scripts if prompted
pnpm approve-builds

# Start the development server
pnpm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## Troubleshooting

- **Import Errors**: Ensure you are running `uvicorn` from the `backend/app` directory.
- **DeepL Key**: The API key is loaded from `backend/app/services/keys.env`. Ensure this file exists.
- **pnpm Build Errors**: If dependencies fail to build, run `pnpm approve-builds` or `pnpm install --no-frozen-lockfile`.
