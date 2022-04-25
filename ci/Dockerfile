# build environment
FROM node:14-alpine as build
RUN apk add --no-cache git
WORKDIR /app
COPY . ./
RUN rm -rf node_modules && rm package-lock.json
RUN npm cache clean --force
RUN npm install yarn
ARG ENV
ARG REACT_APP_TITLE
ARG REACT_APP_CLIENT_ICON_FOLDER
RUN yarn install --network-timeout 600000
RUN yarn build
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

COPY ./ci/default.conf /etc/nginx/templates/default.conf.template
COPY .env.template /usr/share/nginx/html

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
COPY ./ci/process-env.sh /docker-entrypoint.d/100-process-env.sh
RUN chmod u+x /docker-entrypoint.d/100-process-env.sh
# Default port exposure
EXPOSE 80
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
