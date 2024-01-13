FROM node:18 as base
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
RUN npm install --silent
COPY . /app/
EXPOSE 4001

FROM base as dev
RUN npm install -g --silent nodemon
CMD ["npm", "run", "dev"]

FROM base as prod
RUN npm run build
RUN npm install --production --silent
RUN npm install -g --silent pm2 
CMD ["pm2-runtime", "./dist/Bot.js"]
