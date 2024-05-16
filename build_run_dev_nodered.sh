#!/bin/bash

docker container stop node-red
# Remove existing container if it exists
docker container rm node-red

# Build the Docker image
docker build --progress=plain . -t nodered-local:latest --no-cache

# Run the Docker container with port mapping and volume mapping
docker run --name node-red -p 1880:1880 -d nodered-local:latest 
