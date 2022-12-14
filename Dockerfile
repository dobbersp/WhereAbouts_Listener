#Documentation:
#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# syntax=docker/dockerfile:1
FROM node

WORKDIR /usr/src/app

# install app
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# final configuration
EXPOSE 1111

#Run
CMD [ "node", "listener.js" ]
