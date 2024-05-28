# build environment
FROM node:16-alpine as builder
# declaring environemnt variables
ARG ENV
ARG REACT_APP_TITLE
ARG REACT_APP_CLIENT_ICON_FOLDER
# build
WORKDIR /app
COPY package.json yarn.lock ./
COPY src/common/package.json ./src/common/package.json
RUN yarn install
COPY . ./
RUN yarn build && yarn rm-source-maps

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

COPY ./ci/default.conf /etc/nginx/templates/default.conf.template
COPY .env.template /usr/share/nginx/html

# Add bash, needed below do not remove
RUN apk add --no-cache bash

# Make our shell script executable
COPY ./ci/process-env.sh /docker-entrypoint.d/100-process-env.sh
RUN chmod u+x /docker-entrypoint.d/100-process-env.sh
# Default port exposure
EXPOSE 80
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
