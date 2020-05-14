FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ .
RUN npm run build-docker

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist-docker /app
COPY docker/nginx.conf /etc/nginx/nginx.conf
