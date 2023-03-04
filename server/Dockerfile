FROM node:16
COPY package.json .
RUN npm install
COPY . .

EXPOSE 8081
CMD ["node","src/app.js"]