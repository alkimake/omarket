FROM node:lts-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git python build-base

RUN yarn global add truffle

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

CMD ["truffle", "compile"]
