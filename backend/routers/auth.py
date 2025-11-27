from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.orm import Session
from ..database import get_db

# APIRouter: Lets you organize endpoints into groups or modules.
# Depends: Used for dependency injection (for things like authentication, database sessions, etc).
# HTTPException: Used to respond with error status codes and messages.
# status: Contains HTTP status code constants

# router: Creates a new API router object (you’ll attach endpoints to this).
# security: Sets up HTTP Basic authentication scheme, it knows how to parse the authorization header.

router = APIRouter()
security = HTTPBasic()


# Hardcoded credentials for simplicity
USERNAME = "admin"
PASSWORD = "password"

# this fucntion is created as a depedency for the endpoints.
# Accepts user credentials (from the HTTP Basic Auth prompt) using Depends(security)
# Depends(security): Tells FastAPI to run the security scheme before the function. 
# It extracts username:password from the header, decodes base64, and returns an HTTPBasicCredentials object
# HTTPEXCEPTION is a response given.

# WWW-Authenticate is a special HTTP header used by servers to tell the browser or client:
# “This resource requires authentication, and you must use HTTP Basic Auth to access it.”

def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != USERNAME or credentials.password != PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# The login function takes an argument user, which depends on the authenticate function (so if not authenticated, request fails before it gets here).
# If authentication succeeds, returns a JSON message:
@router.get("/login")
def login(user: str = Depends(authenticate)):
    return {"message": f"Logged in as {user}"}


# ToDo: the need for the sesion should be satidsfied or removed
# ToDo: the need for the get_db should be satidsfied or removed