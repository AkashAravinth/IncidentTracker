from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./incident_tracker.db"

# create_engine craetes a connection to the database.

# check_same_thread, Allows the same database connection to be shared across different threads (important for some web frameworks like FastAPI).

# check_same_thread=True, Each database connection can only be used in the thread where it was created, 
# If you try to use that connection in a different thread, you'll get an error.

# check_same_thread=False, Allow connection to be shared across threads

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# session is a connection.
# sessionmaker: This generates a factory function for creating new SQLAlchemy database session objects.
# autocommit=False: You have to call .commit() manually to save changes to the database, giving you full control over transactions.
# autoflush=False: Your unsaved changes aren’t automatically flushed (sent) to the database on each query; you control when changes go out.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# It is a declarative base class. so the SQLAlchemy model (Incident class present in the models.py) is iherited from the Base class
# It enables SQLAlchemy to automatically map Python classes/attributes to database tables/columns.
Base = declarative_base()

# db = SessionLocal() creates a fresh session when a route needs the database.

# yield db allows the route to use that session for the duration of its work.

# finally: When the route/task is done, the session is reliably closed
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()