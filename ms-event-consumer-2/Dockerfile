# Installer
FROM node:lts-slim AS installer
WORKDIR /www/app
COPY package.json ./

RUN npm install -f --prod --quiet
RUN npm install -g @nestjs/cli


# Builder
FROM installer AS builder
COPY --from=installer /www/app /www/app
WORKDIR /www/app

COPY ./ ./
RUN npm run build


# Runner
FROM node:lts-slim
COPY --from=builder /www/app /www/app

WORKDIR /www/app

EXPOSE 3000
ENTRYPOINT npm run start:prod
