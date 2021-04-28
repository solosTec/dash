FROM node:14 as build-stage

ARG NPM_BUILD_COMMAND

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ .
RUN echo $NPM_BUILD_COMMAND
RUN npm run $NPM_BUILD_COMMAND
RUN npm run build-no-auth
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist-docker /app
COPY docker/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist-no-auth /app/dist-no-auth

COPY --from=build-stage /app/dist /app/dist
