FROM node:26-alpine
EXPOSE 8080

ENV NODE_ENV=production

WORKDIR /app
COPY . .

RUN npm install && npm install -g npm@12.2.1 && npm audit fix --force

CMD ["node", "server/httpd.js"]
