# étape de build
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# étape de production
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/index.html /usr/share/nginx/html/index.html
COPY --from=build-stage /app/dist /usr/share/nginx/html/dist/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
