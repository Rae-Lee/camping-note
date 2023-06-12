FROM node:latest
WORKDIR '/app'
COPY ./package.json ./app
RUN npm install & npm cache clean --force
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]