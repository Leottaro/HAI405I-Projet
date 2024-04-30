FROM node:22-alpine
WORKDIR /client

# Copy dependencies and install them
COPY package.json ./
RUN npm install

COPY . .
RUN run build
EXPOSE 9090
CMD npm run serve