# Use Python 3.11 slim image for the python base image.
# the python base image has the python runtime
FROM python:3.11-slim

# WORKDIR /app: Sets /app as the default directory for subsequent commands (like CMD). This is where your code is located.
WORKDIR /app

# requirements.txt is the source file.
# The . (dot) is the destination path inside the container, representing the current working directory (set earlier by WORKDIR /app).
COPY requirements.txt .

# Runs the pip install command during the image build to install all listed packages (e.g., FastAPI, SQLAlchemy, uvicorn). 
# The --no-cache-dir flag prevents caching downloaded packages, keeping the image smaller.
RUN pip install --no-cache-dir -r requirements.txt

# This copies all files and directories from the build context (your backend/ directory on the host) into the container's working directory (/app/backend).
# It includes your Python files (e.g., main.py, models.py), subdirectories (e.g., routers/), and other assets.
COPY . /app/backend

# Purpose: Documents that the container's application (FastAPI) listens on port 8000. It doesn't open the port automatically but signals to Docker (and tools like docker run) which port to expect.
# How it works: When you run the container with docker run -p 8000:8000, Docker maps the host's port 8000 to the container's port 8000, allowing external access.
EXPOSE 8000

# CMD is a Dockerfile directive that specifies the command to run inside the container once it's launched.
# It uses an array format (["executable", "param1", "param2", ...]) to avoid shell interpretation issues, ensuring the command runs directly without a shell wrapper.
# Unlike RUN (which executes during image build), CMD runs at container runtime(which means while the container is runned). 

# Uvicorn is an ASGI (Asynchronous Server Gateway Interface) web server implementation for Python, commonly used to serve asynchronous web applications.
# It's lightweight, high-performance, and designed for frameworks like FastAPI, Starlette, or Django with async support.
# "backend.main" refers to a Python module path: the main.py file inside a backend directory (relative to the container's working directory).
# ":app" indicates the specific object (instance) within that module to run. Here, app is likely a FastAPI application instance defined in backend/main.py)
# The --host flag binds the server to a specific network interface.
# "0.0.0.0" means "all available network interfaces" on the host machine. This allows the server to accept connections from outside the container
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
