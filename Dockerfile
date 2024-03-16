FROM node:18 as base
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
RUN npm install --silent
RUN npm install -g --silent nodemon
COPY . /app/

FROM base as dev
CMD ["npm", "run", "dev"]

FROM base as prod
RUN npm install -g --silent pm2 typescript
RUN npm run build
RUN rm -r node_modules
RUN npm install --production --silent
COPY . /app/
RUN npm run build
CMD ["pm2-runtime", "./dist/Bot.js"]
