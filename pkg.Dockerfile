FROM node:17.3

WORKDIR /app

COPY . .
RUN npm ci --only=production
RUN npm --prefix src/api ci --only=production
RUN npm --prefix src/client ci --only=production
RUN npm run pkg