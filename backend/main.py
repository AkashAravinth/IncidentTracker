from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import incidents, auth

# models.Base is typically the declarative base class for your ORM models where all table definitions are collected.
# metadata is an object that holds schema-level information about the tables.
# create_all() issues SQL statements to create tables in the database if they do not already exist.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Incident Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In FastAPI, the tags parameter in app.include_router is used to categorize API endpoints in the automatically generated documentation
# tags is a list of strings that labels and groups related endpoints/routes together for better organization and readability in the API docs.
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])

# A Python decorator function takes another function, adds functionality (like registering it as a route), and returns the enhanced version.
# @app.get("/")
# This is a decorator that tells FastAPI to handle HTTP GET requests to the root URL (/).
# Whenever someone visits your site’s base URL (like http://localhost:8000/), this endpoint runs.

# def read_root():
# This defines a Python function named read_root.
# This function will be called to handle requests to /

# return {"message": "Incident Tracker API"}
# The function returns a Python dictionary, which FastAPI automatically converts to JSON for the HTTP response

@app.get("/")
def read_root():
    return {"message": "Incident Tracker API"}