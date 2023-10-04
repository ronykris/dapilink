FROM ubuntu:latest as base
RUN apt-get update && apt-get install bash sudo nodejs npm -y
WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN mkdir -p /tmp/ipfs-docker-staging; chown -R node:node /tmp/ipfs-docker-staging
RUN mkdir -p /tmp/ipfs-docker-data; chown -R node:node /tmp/ipfs-docker-data

RUN npm run build
CMD npm run login; npm run start