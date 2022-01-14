# Build client
FROM node:17.3.1 as client

ARG DEPLOYMENT_ENV=production
ARG DEFAULT_NOTICES=
ARG NCCRD_TECHNICAL_CONTACT=zd.smith@saeon.nrf.ac.za
ARG DEFAULT_TENANT_ADDRESS

WORKDIR /nccrd-client

RUN echo "" > .env
RUN echo "DEFAULT_TENANT_ADDRESS=$DEFAULT_TENANT_ADDRESS" >> .env
RUN echo "DEPLOYMENT_ENV=$DEPLOYMENT_ENV" >> .env
RUN echo "DEFAULT_NOTICES=$DEFAULT_NOTICES" >> .env
RUN echo "NCCRD_TECHNICAL_CONTACT=$NCCRD_TECHNICAL_CONTACT" >> .env
RUN echo "HOSTNAME=origin" >> .env

COPY src/client .
RUN npm ci --only=production
RUN npm run build




# Start API
FROM node:17.3.1-alpine

ARG ODP_AUTH_CLIENT_ID=SAEON.NCCIS
ENV ODP_AUTH_CLIENT_ID=$ODP_AUTH_CLIENT_ID

ARG LOG_SQL_QUERIES=true
ENV LOG_SQL_QUERIES=$LOG_SQL_QUERIES

ARG FILES_DIRECTORY=/nccrd-assets
ENV FILES_DIRECTORY=$FILES_DIRECTORY

ARG LOG_REQUEST_DETAILS=true
ENV LOG_REQUEST_DETAILS=$LOG_REQUEST_DETAILS

ARG ODP_AUTH_CLIENT_SECRET=
ENV ODP_AUTH_CLIENT_SECRET=$ODP_AUTH_CLIENT_SECRET

ARG DEFAULT_SYSADMIN_EMAIL_ADDRESSES=zd.smith@saeon.nrf.ac.za
ENV DEFAULT_SYSADMIN_EMAIL_ADDRESSES=$DEFAULT_SYSADMIN_EMAIL_ADDRESSES

ARG DEFAULT_ADMIN_EMAIL_ADDRESSES=
ENV DEFAULT_ADMIN_EMAIL_ADDRESSES=$DEFAULT_ADMIN_EMAIL_ADDRESSES

ARG DEPLOYMENT_ENV=production
ENV DEPLOYMENT_ENV=$DEPLOYMENT_ENV

ARG SSL_ENV=production
ENV SSL_ENV=$SSL_ENV

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

ARG HOSTNAME=http://localhost:3001
ENV HOSTNAME=$HOSTNAME

WORKDIR /app
COPY src/api .
COPY --from=client /nccrd-client/dist src/client-dist
RUN npm ci --only=production
EXPOSE 3000


CMD \
  LOG_REQUEST_DETAILS=$LOG_REQUEST_DETAILS \
  FILES_DIRECTORY=$FILES_DIRECTORY \
  LOG_SQL_QUERIES=$LOG_SQL_QUERIES \
  DEFAULT_SYSADMIN_EMAIL_ADDRESSES=$DEFAULT_SYSADMIN_EMAIL_ADDRESSES \
  ODP_AUTH_CLIENT_ID=$ODP_AUTH_CLIENT_ID \
  ODP_AUTH_CLIENT_SECRET=$ODP_AUTH_CLIENT_SECRET \
  HOSTNAME=$HOSTNAME \
  DEPLOYMENT_ENV=$DEPLOYMENT_ENV \
  SSL_ENV=$SSL_ENV \
  DEFAULT_ADMIN_EMAIL_ADDRESSES=$DEFAULT_ADMIN_EMAIL_ADDRESSES \
  MSSQL_USERNAME=$MSSQL_USERNAME \
  MSSQL_PASSWORD=$MSSQL_PASSWORD \
  MSSQL_HOSTNAME=$MSSQL_HOSTNAME \
  MSSQL_DATABASE=$MSSQL_DATABASE \
  MSSQL_PORT=$MSSQL_PORT \
  npm run start:prod