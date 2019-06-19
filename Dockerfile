FROM node:lts-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache git python build-base

RUN yarn global add truffle

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

ADD . /app

RUN truffle compile --contracts_build_directory=./src/build

CMD ["npm", "run", "production"]


FROM nginx
ADD nginx-vhost.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
