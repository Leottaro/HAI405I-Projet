FROM node:22-alpine
WORKDIR /client

# client
COPY . .
RUN npm install 
RUN npm run build
EXPOSE 9090

CMD npm run serve