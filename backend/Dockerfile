FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install express --save
COPY . .

EXPOSE 3000
CMD ["node", "app.js"]
