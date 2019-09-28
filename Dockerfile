FROM node:alpine

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
RUN npm install --quiet

COPY . .