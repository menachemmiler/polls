FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY ["package*.json", "tsconfig*.json", "./"]
COPY .npmrc ./

RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) \
    npm i --silent --progress=false

COPY ./src ./src

RUN npm run build
RUN rm -f .npmrc

FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /usr/src/app/package*.json .
COPY .npmrc ./
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) \
    npm i --omit=dev --silent --progress=false
RUN rm -f .npmrc
COPY --from=build /usr/src/app/dist .
RUN mkdir /app/uploads
CMD ["node", "./index.js"]
