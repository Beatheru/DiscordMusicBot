FROM node:18 as base
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/

FROM base as dev
RUN npm install --silent
RUN npm install -g --silent nodemon
COPY . /app/
CMD ["npm", "run", "dev"]

FROM base as prod
RUN npm install --production --silent
RUN npm install -g --silent pm2 
COPY . /app/
RUN npm run build
CMD ["pm2-runtime", "./dist/Bot.js"]
