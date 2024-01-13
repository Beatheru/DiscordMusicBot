FROM node:18 as base
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
EXPOSE 4001

FROM base as dev
RUN npm install --silent
COPY . /app/
CMD ["npm", "run", "dev"]

FROM base as prod
RUN npm install --production --silent
RUN npm install -g pm2 --silent
RUN npm run build
CMD ["pm2-runtime", "--watch", "./Bot.js"]
