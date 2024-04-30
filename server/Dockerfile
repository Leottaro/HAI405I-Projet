FROM node:22-alpine
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Make a directory for the databases persistent
VOLUME /server/databases

# Run server
EXPOSE 3001
CMD npm start