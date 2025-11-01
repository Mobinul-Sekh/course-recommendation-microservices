# Use Node LTS base image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all source code
COPY . .

# Expose the service port
EXPOSE 7000

# Start the service
CMD ["npm", "start"]
