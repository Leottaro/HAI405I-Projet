FROM node:22-alpine
WORKDIR /server

# Copy dependencies and install them
COPY package.json ./
RUN npm install

COPY . .
VOLUME /server/databases
EXPOSE 3001
CMD npm start