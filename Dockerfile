ARG NCCRD_HOSTNAME=http://localhost:3001

# Build client
FROM node:16.12 as client

ARG NCCRD_DEPLOYMENT_ENV=production
ARG NCCRD_CLIENT_DEFAULT_NOTICES=
ARG NCCRD_TECHNICAL_CONTACT=zd.smith@saeon.nrf.ac.za

WORKDIR /nccrd-client

RUN echo "" > .env
RUN echo "NCCRD_DEPLOYMENT_ENV=$NCCRD_DEPLOYMENT_ENV" >> .env
RUN echo "NCCRD_CLIENT_DEFAULT_NOTICES=$NCCRD_CLIENT_DEFAULT_NOTICES" >> .env
RUN echo "NCCRD_TECHNICAL_CONTACT=$NCCRD_TECHNICAL_CONTACT" >> .env
RUN echo "NCCRD_HOSTNAME=$NCCRD_HOSTNAME" >> .env

COPY src/client .
RUN npm ci --only=production
RUN npm run build




# Start API
FROM node:16.12-alpine

ARG SAEON_AUTH_CLIENT_ID=SAEON.NCCIS
ENV SAEON_AUTH_CLIENT_ID=$SAEON_AUTH_CLIENT_ID

ARG LOG_SQL_QUERIES=true
ENV LOG_SQL_QUERIES=$LOG_SQL_QUERIES

ARG SAEON_AUTH_CLIENT_SCOPES=SAEON.NCCIS openid
ENV SAEON_AUTH_CLIENT_SCOPES=$SAEON_AUTH_CLIENT_SCOPES

ARG NCCRD_API_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
ENV NCCRD_API_ALLOWED_ORIGINS=$NCCRD_API_ALLOWED_ORIGINS

ARG FILES_DIRECTORY=/nccrd-assets
ENV FILES_DIRECTORY=$FILES_DIRECTORY

ARG LOG_REQUEST_DETAILS=true
ENV LOG_REQUEST_DETAILS=$LOG_REQUEST_DETAILS

ARG SAEON_AUTH_CLIENT_SECRET=
ENV SAEON_AUTH_CLIENT_SECRET=$SAEON_AUTH_CLIENT_SECRET

ARG NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES=zd.smith@saeon.nrf.ac.za
ENV NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES=$NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES

ARG NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES=
ENV NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES=$NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES

ARG NCCRD_DEPLOYMENT_ENV=production
ENV NCCRD_DEPLOYMENT_ENV=$NCCRD_DEPLOYMENT_ENV

ARG NCCRD_SSL_ENV=production
ENV NCCRD_SSL_ENV=$NCCRD_SSL_ENV

ARG MSSQL_USERNAME=sa
ENV MSSQL_USERNAME=$MSSQL_USERNAME

ARG MSSQL_PASSWORD=password!123#
ENV MSSQL_PASSWORD=$MSSQL_PASSWORD

ARG MSSQL_HOSTNAME=localhost
ENV MSSQL_HOSTNAME=$MSSQL_HOSTNAME

ARG MSSQL_DATABASE=nccrd_next
ENV MSSQL_DATABASE=$MSSQL_DATABASE

ARG MSSQL_PORT=1433
ENV MSSQL_PORT=$MSSQL_PORT

ENV NCCRD_HOSTNAME=$NCCRD_HOSTNAME

WORKDIR /app
COPY src/api .
COPY --from=client /nccrd-client/dist src/client-dist
RUN npm ci --only=production
EXPOSE 3000


CMD \
  LOG_REQUEST_DETAILS=$LOG_REQUEST_DETAILS \
  FILES_DIRECTORY=$FILES_DIRECTORY \
  LOG_SQL_QUERIES=$LOG_SQL_QUERIES \
  NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES=$NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES \
  SAEON_AUTH_CLIENT_ID=$SAEON_AUTH_CLIENT_ID \
  SAEON_AUTH_CLIENT_SCOPES=$SAEON_AUTH_CLIENT_SCOPES \
  SAEON_AUTH_CLIENT_SECRET=$SAEON_AUTH_CLIENT_SECRET \
  NCCRD_HOSTNAME=$NCCRD_HOSTNAME \
  NCCRD_DEPLOYMENT_ENV=$NCCRD_DEPLOYMENT_ENV \
  NCCRD_SSL_ENV=$NCCRD_SSL_ENV \
  NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES=$NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES \
  MSSQL_USERNAME=$MSSQL_USERNAME \
  MSSQL_PASSWORD=$MSSQL_PASSWORD \
  MSSQL_HOSTNAME=$MSSQL_HOSTNAME \
  MSSQL_DATABASE=$MSSQL_DATABASE \
  MSSQL_PORT=$MSSQL_PORT \
  npm run start:prod