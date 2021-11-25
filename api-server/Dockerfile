FROM node:14

WORKDIR /api-server

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npm", "start", "app.js" ]