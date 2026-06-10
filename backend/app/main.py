from fastapi import FastAPI
from dotenv import load_dotenv
from routers import pdf

load_dotenv()

app = FastAPI(title="PDF Image Translator")

app.include_router(pdf.router)