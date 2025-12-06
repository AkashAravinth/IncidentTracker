# Uses Alpine Linux (a lightweight Linux distribution) as the base image for the container. 
# Alpine is minimal and commonly used for small Docker images.
FROM alpine:latest

# Runs the Alpine package manager (apk) to install SQLite. 
# The --no-cache flag prevents caching of package indexes, keeping the image smaller by not storing unnecessary files.
RUN apk add --no-cache sqlite

# Sets the working directory inside the container to /db. All subsequent commands (like COPY, CMD) will execute relative to this directory
WORKDIR /db

# Copies the incident_tracker.db file from the parent directory (relative to the build context) into the current working directory (/db) inside the container. 
# The dot (.) represents the current directory.
COPY incident_tracker.db .

# Documents that the container doesn't expose any specific port (port 0 means no port). 
# This is unusual for a database container, as SQLite doesn't run a server process - it's just a file-based database.
EXPOSE 0

# The CMD ["tail", "-f", "/dev/null"] instruction in the db/Dockerfile is a common Docker pattern 
# used to keep a container running indefinitely without performing any actual work.
# tail: A standard Unix/Linux command that displays the last part (tail) of files
# -f: The "follow" flag tells tail to continuously monitor the file for new content and output any new lines as they're added
# /dev/null: A special virtual file in Unix-like systems that acts as a "black hole" 
# - any data written to it is immediately discarded and never stored
# tail -f /dev/null starts monitoring /dev/null for new content
# Since /dev/null never receives new data, tail keeps running in "follow" mode
CMD ["tail", "-f", "/dev/null"]
