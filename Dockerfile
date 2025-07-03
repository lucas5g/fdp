# Base image
FROM node:22

ENV TZ=America/Sao_Paulo


# Set working directory
WORKDIR /usr/src/app

# Copy only package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

RUN npx playwright install-deps       
RUN npx playwright install


# Expose port
EXPOSE 8000

# Start the server
CMD ["npm", "run", "start"]
