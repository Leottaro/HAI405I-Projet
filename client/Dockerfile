FROM node:22-alpine
WORKDIR /client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the client
RUN npm run build

# Run client
EXPOSE 9090
CMD npm run serve