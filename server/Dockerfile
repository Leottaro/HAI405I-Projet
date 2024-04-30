FROM node:22-alpine
WORKDIR /server

# server
COPY . .
RUN npm install
VOLUME /server/databases
EXPOSE 3001

CMD npm start