FROM node:18.17-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "index.js"]