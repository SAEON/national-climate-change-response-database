FROM node:20.3.0

WORKDIR /app

COPY . .
RUN npm ci --only=production
RUN npm --prefix src/api ci --only=production
RUN npm --prefix src/client ci --only=production
RUN npm run pkg