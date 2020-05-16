FROM node:latest as build-stage

ARG NPM_BUILD_COMMAND

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ .
RUN echo $NPM_BUILD_COMMAND
RUN npm run $NPM_BUILD_COMMAND

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist-docker /app
COPY docker/nginx.conf /etc/nginx/nginx.conf
