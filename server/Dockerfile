FROM node:22-alpine
WORKDIR /server

# server
COPY . .
RUN npm install
VOLUME /server/databases

CMD npm start