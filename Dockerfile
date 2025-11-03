FROM node:20.19.5-slim

WORKDIR /app

COPY ./ ./

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "start"]