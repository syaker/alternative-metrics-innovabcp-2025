FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 3000
EXPOSE 4000

CMD ["sh", "-c", "yarn prisma:migrate:prod && yarn start:prod"]
