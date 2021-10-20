FROM node:14

WORKDIR /dns-server

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npm", "start", "app.js" ]