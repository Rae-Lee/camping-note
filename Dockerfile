FROM node:latest
ENV PORT 8080
ENV HOST 0.0.0.0
WORKDIR '/app'
COPY ./package.json ./app
RUN npm install
RUN npm install express
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]