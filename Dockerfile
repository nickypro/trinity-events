FROM node:15
# 1. Creating the app directory
WORKDIR /usr/src/app
# 2. Install app dependencies for the application
# A package*.json is used to make sure the 
# package.json, package-lock.json are to be copied
COPY package*.json ./
# 3 RUN npm install --only=production for production
RUN npm install --only=production
# Bundle the app source
COPY . .
EXPOSE 80
CMD [ "node", "server.js" ]
