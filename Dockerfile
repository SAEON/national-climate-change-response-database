# Build client
FROM node:16.7 as client

ARG NCCRD_DEPLOYMENT_ENV
ARG NCCRD_CLIENT_DEFAULT_NOTICES
ARG NCCRD_TECHNICAL_CONTACT
ARG NCCRD_HOSTNAME

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
FROM node:16.7-alpine

ARG NCCRD_API_RESET_SCHEMA
ENV NCCRD_API_RESET_SCHEMA=$NCCRD_API_RESET_SCHEMA

ARG SAEON_AUTH_CLIENT_ID
ENV SAEON_AUTH_CLIENT_ID=$SAEON_AUTH_CLIENT_ID

ARG LOG_SQL_QUERIES
ENV LOG_SQL_QUERIES=$LOG_SQL_QUERIES

ARG SAEON_AUTH_CLIENT_SCOPES
ENV SAEON_AUTH_CLIENT_SCOPES=$SAEON_AUTH_CLIENT_SCOPES

ARG FILES_DIRECTORY
ENV FILES_DIRECTORY=$FILES_DIRECTORY

ARG LOG_REQUEST_DETAILS
ENV LOG_REQUEST_DETAILS=$LOG_REQUEST_DETAILS

ARG SAEON_AUTH_CLIENT_SECRET
ENV SAEON_AUTH_CLIENT_SECRET=$SAEON_AUTH_CLIENT_SECRET

ARG NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES
ENV NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES=$NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES

ARG NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES
ENV NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES=$NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES

ARG NCCRD_DEPLOYMENT_ENV
ENV NCCRD_DEPLOYMENT_ENV=$NCCRD_DEPLOYMENT_ENV

ARG NCCRD_SSL_ENV
ENV NCCRD_SSL_ENV=$NCCRD_SSL_ENV

ARG MSSQL_USERNAME
ENV MSSQL_USERNAME=$MSSQL_USERNAME

ARG MSSQL_PASSWORD
ENV MSSQL_PASSWORD=$MSSQL_PASSWORD

ARG MSSQL_HOSTNAME
ENV MSSQL_HOSTNAME=$MSSQL_HOSTNAME

ARG MSSQL_DATABASE
ENV MSSQL_DATABASE=$MSSQL_DATABASE

ARG MSSQL_PORT
ENV MSSQL_PORT=$MSSQL_PORT

ARG NCCRD_HOSTNAME
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
  NCCRD_API_RESET_SCHEMA=$NCCRD_API_RESET_SCHEMA \
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