FROM node:lts-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git python build-base

RUN npm i -g truffle

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN npm i

CMD ["truffle", "compile"]
