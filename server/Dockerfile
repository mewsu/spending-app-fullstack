# Use the official Node.js 16 as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Install build tools to compile native npm modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages specified in package.json
# We use --unsafe-perm to ensure proper access rights for post-install scripts
RUN npm install --unsafe-perm

# Copy the rest of your application's code
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV NODE_ENV=production

# Run index.js when the container launches
CMD ["node", "./index.js"]
