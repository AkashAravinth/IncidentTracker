#  APIRouter for defining route handlers
#  Depends for dependency injection
# HTTPException for raising HTTP errors

# Query, In FastAPI, the Query function is used to declare and handle query parameters in your API endpoint functions explicitly. 
# Query parameters are the key-value pairs you see in URLs after the question mark (?), for example, /items?skip=10&limit=20.

# Imports Session from SQLAlchemy's ORM for database session management, allowing interaction with the database.

# List: Specifies that a variable or function return is expected to be a list of certain types. For example, List[Incident] means a list where each element is an Incident object.
# Optional: Means a value that could be either the specified type or None. It is equivalent to Union[type, None]. For example, Optional[str] means either a str or None.

# The BaseModel in Pydantic is a fundamental class used to define data models with automatic data validation and parsing in Python. 
# When you create a class that inherits from pydantic.BaseModel, you define the structure of your data using Python type annotations.
# Python type annotation, also known as type hinting, is an optional syntax introduced to specify the expected data types of variables, function parameters, and return values directly in the code.

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Incident
from ..routers.auth import authenticate
from pydantic import BaseModel

# dependencies=[Depends(authenticate)]: This argument attaches the Depends(authenticate) dependency to the entire router.
# This configuration applies the dependency to all route functions defined within that router, meaning every request to any route in this router will automatically run the authenticate function before executing the route handler.
# The part responsible for making it "global" is the fact that you place this dependencies parameter at the router creation level, not on individual route decorators.
# The reason why the dependencies parameter is enclosed within square brackets [] in the APIRouter instantiation:
# is because the dependencies argument expects a list of dependency instances.

router = APIRouter(dependencies=[Depends(authenticate)])

# These classes define data schemas for requests and responses, ensuring validation and serialization.
# Serialization, in the context of Pydantic model definitions, means the process of converting a Pydantic model instance (an in-memory Python object) into a format suitable for storage or transmission, typically into a dictionary or JSON string.

# Defines a base Pydantic model for incident data with common fields.

class IncidentBase(BaseModel):
    title: str
    desc: Optional[str] = None
    status: Optional[str] = "Open"
    priority: Optional[str] = "Medium"

# pass
# Placeholder indicating no additional fields or methods.

class IncidentCreate(IncidentBase):
    pass

# the title is given as Optional[str] = Noden because in update there is no need for mandatory updation of that field

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    desc: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

# class Config:
# Defines Pydantic configuration for the model.
# from_attributes = True
# Allows Pydantic to populate the model from SQLAlchemy model attributes (e.g., database objects), enabling automatic conversion.

class IncidentResponse(IncidentBase):
    id: int
    created_at: str
    updated_at: Optional[str]

    class Config:
        from_attributes = True

        
# def create_incident(incident: IncidentCreate, db: Session = Depends(get_db)):\
# Defines the function create_incident. It takes two parameters:
# incident: An instance of IncidentCreate (a Pydantic model inheriting from IncidentBase), which validates and parses the incoming JSON request body.
# db: A SQLAlchemy Session object injected via FastAPI's dependency injection system using Depends(get_db). This provides a database connection for the operation.

# db_incident = Incident(**incident.dict())
# Creates a new instance of the Incident SQLAlchemy model (defined in models.py) by unpacking the dictionary representation of the incident Pydantic model. This converts the validated input data into a database-ready object, mapping fields like title, desc, status, and priority.

# db.add(db_incident)
# Adds the newly created Incident object to the SQLAlchemy session. This stages the object for insertion into the database but does not yet execute the query.

# db.commit()
# Commits the transaction to the database, executing the INSERT operation and persisting the new incident record. This makes the changes permanent in the database.

# db.refresh(db_incident)
# Refreshes the db_incident object from the database. This updates the object with any auto-generated or default values (e.g., id, created_at, updated_at) that were set by the database during the commit.

# return db_incident
# Returns the refreshed Incident object. FastAPI automatically serializes this into JSON using the IncidentResponse model, including the newly assigned id and timestamps

# In the context of the create_incident function explanation, "parsing" refers to the process where Pydantic (the library used for the IncidentCreate model) takes the raw JSON data from the incoming HTTP request body and converts it into a structured Python object. This includes:
# Validation: Checking that the data matches the expected types and constraints (e.g., title must be a string, desc can be a string or None).
# Type Conversion: Automatically converting JSON types to Python types (e.g., JSON strings to Python str, handling optional fields).
# Error Handling: Raising validation errors if the input doesn't conform to the model schema.

# In the line db_incident = Incident(**incident.dict()), the ** is Python's dictionary unpacking operator. It takes the dictionary returned by incident.dict() (which contains the validated data from the Pydantic model, e.g., {"title": "Network Issue", "desc": "Server down", ...}) and unpacks it as keyword arguments to the Incident class constructor
# Incident(title="Network Issue", desc="Server down", ...)

@router.post("/", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    db_incident = Incident(**incident.dict())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

# The response_model=List[IncidentResponse] specifies that the response will be a list of IncidentResponse objects, 
# ensuring each item in the list is validated and serialized according to that Pydantic model.

# status: Optional[str] = Query(None, description="Filter by status"),
# Defines an optional query parameter status of type str or None. The Query(None, description="Filter by status") declares it as a URL query parameter (e.g., ?status=Open), 
# with a default value of None and a description for API documentation.

# query = db.query(Incident)
# Creates a SQLAlchemy query object with the Incident model. 
# This sets up a base query to select all incidents from the database.

# query = query.filter(Incident.status == status)
# Applies a filter to the query to only include incidents where the status column matches the provided status value. 
# This modifies the query object in place.

@router.get("/", response_model=List[IncidentResponse])
def list_incidents(
    status: Optional[str] = Query(None, description="Filter by status"),
    sort_by: str = Query("created_at", description="Sort by field"),
    skip: int = Query(0, description="Number of items to skip"),
    limit: int = Query(10, description="Number of items to return"),
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    if status:
        query = query.filter(Incident.status == status)
    if sort_by == "created_at":
        query = query.order_by(Incident.created_at.desc())
    query = query.offset(skip).limit(limit)
    return query.all()

# In the line incident = db.query(Incident).filter(Incident.id == incident_id).first(), the .first() method is used to execute the query
# and retrieve the first (and typically only) matching record from the database.
# What incident Represents:
# Variable Assignment: It stores the result of the query, which is either an instance of the Incident SQLAlchemy mode
# Without .first(), db.query(Incident).filter(...) returns a SQLAlchemy Query object, not the actual data. .first() executes the query against the database.

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

# Purpose of exclude_unset=True:
# Selective Inclusion: It only includes fields that were explicitly provided in the request body.
# Fields that were not sent (i.e., "unset") are excluded from the dictionary.

@router.put("/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: int, incident_update: IncidentUpdate, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    for key, value in incident_update.dict(exclude_unset=True).items():
        setattr(incident, key, value)
    db.commit()
    db.refresh(incident)
    return incident

@router.delete("/{incident_id}")
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    db.delete(incident)
    db.commit()
    return {"message": "Incident deleted"}