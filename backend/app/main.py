import os
from dotenv import load_dotenv
from fastapi import FastAPI

# Load environment variables before importing routers that depend on them
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "services", "keys.env"))

from routers import pdf, translate

app = FastAPI(title="PDF Image Translator")

app.include_router(pdf.router)
app.include_router(translate.router)