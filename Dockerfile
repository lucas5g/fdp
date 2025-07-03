# Base image
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY . .

# Install app dependencies
RUN npm install

# Build the app
# RUN npx prisma generate
RUN npm run build


# Expose port
EXPOSE 8000

# Start the server
CMD [ "npm", "run", "start" ]
