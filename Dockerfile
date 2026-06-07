FROM node:24.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts

RUN adduser -D -u 10001 usr
RUN chown usr:usr /app

COPY --chown=usr:usr ./ ./

USER usr

EXPOSE 3000

CMD ["npm", "run", "start"]