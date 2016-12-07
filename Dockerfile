# Set the base image to Ubuntu
FROM node:6.0.0

# Copy app to /src
COPY . /src

# Expose port
EXPOSE 3000

# Call the init script
CMD cd src && npm start
