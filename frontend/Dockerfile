# Multi-Stage Build Overview
# Docker multi-stage builds use multiple FROM statements to create separate "stages" in a single Dockerfile.
# Each stage can have its own base image and purpose, allowing you to discard unnecessary files/dependencies from earlier stages in the final image.
# This keeps the production image smaller, more secure, and optimized for runtime (no build tools or source code included).

# Build stage
# node:18-alpine is a Docker image with Node.js version 18 installed on Alpine Linux (a lightweight OS).
# The node:18-alpine Docker image is designed for running Node.js applications. It includes:
# Node.js runtime (version 18)
# npm (Node Package Manager) for installing dependencies
# A minimal Linux environment (Alpine) to keep the image small
FROM node:18-alpine as build

WORKDIR /app

# COPY package*.json ./ copies the package.json and package-lock.json files from the host's frontend/ directory (the build context) to the current working directory inside the container (/app).
COPY package*.json ./

# npm install installs the dependencies listed in package.json into node_modules. 
RUN npm install

# COPY . . copies all files and directories from the host's frontend/ directory (the build context) to the current working directory in the container (/app).
COPY . .

# RUN npm run build executes the "build" script defined in package.json.
# For a Create React App project, this script:
# Compiles the React code into optimized static files (HTML, CSS, JS).
# Places the output in a build/ directory.
# Prepares the app for production deployment (minification, etc.).
RUN npm run build

# Production stage

# FROM nginx:alpine starts a new stage using the nginx:alpine image as the base.
# FROM nginx:alpine – Uses a lightweight Nginx web server on Alpine Linux. Nginx is optimized for serving static files (HTML, CSS, JS) efficiently, without needing Node.js or build tools.
FROM nginx:alpine

# COPY --from=build /app/build /usr/share/nginx/html: Copies the build/ directory (containing the compiled React app) from the "build" stage to /usr/share/nginx/html in the Nginx container. This is Nginx's default directory for serving static files.
# /app/build is the directory inside the "build" stage where npm run build outputs the compiled React app files
COPY --from=build /app/build /usr/share/nginx/html

# Informs Docker that the container listens on port 80, allowing access to the web server.
EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"] sets the command that runs when the container starts(when the container is run).

# CMD defines the default executable for the container.
# nginx is the command to start the Nginx web server.
# -g 'daemon off;' is a global configuration directive passed to Nginx:
# -g allows setting global directives from the command line.
# 'daemon off;' tells Nginx not to run as a background daemon process.
CMD ["nginx", "-g", "daemon off;"]