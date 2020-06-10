FROM node:4.9.1 AS builder

RUN apt-get update && \
    apt-get install -y libasound2-dev

USER node
COPY --chown=node . /home/node/app
WORKDIR /home/node/app
RUN npm install


FROM nginx:1.18.0-alpine
COPY --from=builder /home/node/app /usr/share/nginx/html
