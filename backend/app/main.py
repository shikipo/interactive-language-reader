import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables before importing routers that depend on them
load_dotenv(
    dotenv_path=os.path.join(
        os.path.dirname(__file__),
        "services",
        "keys.env"
    )
)

from app.routers import pdf, translate

app = FastAPI(title="PDF Image Translator")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf.router)
app.include_router(translate.router)