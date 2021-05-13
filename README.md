# national-climate-change-systems
Suite of services - for tracking, analysing, and monitoring climate adaptation and mitigation projects

# README Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Quick start](#quick-start)
  - [System requirements](#system-requirements)
  - [Install source code and dependencies](#install-source-code-and-dependencies)
  - [Local development](#local-development)
- [Deployment](#deployment)
  - [Deploy bundled API + client](#deploy-bundled-api--client)
  - [Containerized deployment](#containerized-deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Quick start

Setup the repository for development on a local machine. The Node.js and React services are run using a local installation of Node.js, and dependent services (Mongo) are run via Docker containers

## System requirements

1. Docker Desktop
2. Node.js **node:14.16.1** (Versions lower than **node:14.13** will not work)

```sh
# Make sure that Node.js ^node:14.16.1 is installed. Follow the instructions at https://github.com/nodesource/distributions/blob/master/README.md#debinstall
# Assuming an Ubuntu Linux environment
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install gcc g++ make # Required for building node-sass and other modules with native bindings
sudo apt-get install -y nodejs
```

## Install source code and dependencies

```sh
# Download the source code
git clone git@github.com:SAEON/catalogue.git catalogue
cd catalogue

# Install package dependencies (this might take several minutes on the first run)
npm run install-dependencies
```

## Local development

```sh
# Start a SQL Server instance (manually create the database)
SQL Server
docker run \
--name sql-server \
--restart always \
-v /home/$USER:/host-mnt \
-e 'ACCEPT_EULA=Y' \
-e 'SA_PASSWORD=password!123#' \
-e 'MSSQL_PID=Developer' \
-p 1433:1433 \
-d \
mcr.microsoft.com/mssql/server:2017-latest-ubuntu

# Start a MongoDB server
docker run --name mongo --restart always -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -d -p 27017:27017 mongo:4.4.3

# Start the Node.js API server
npm run start:api

# Start the React.js client
npm run start:client
```

# Deployment

## Deploy bundled API + client
The easiest way to deploy the application is to serve the React.js static files from the koa.js server. Note that compression IS enabled for API calls (HTTP and GraphQL), but is NOT enabled for static files since this would be better done via a webserver. To start this app in a production environment:

```sh
# Install Node.js 14.16.x on the server (https://nodejs.org/en/)

# Clone the repository if not already done
git clone ... nccrd
cd nccrd

# Install dependencies if not already done
npm run install-dependencies

# Start the application
npm run start:bundled
```

## Deploy as Docker image
```sh
# Create a docker image
docker build -t nccrd .

# Create a docker network so that SQL Server is accessible from the docker container

# --network host should work on Linux, but not other OSes where Docker Engine is running virtualized
docker network create --driver bridge nccrd

# Run as Docker container
docker run \
  --network nccrd \
  --name nccrd \
  -e 'NCCRD_API_ADDRESS=http://localhost:3000' \
  -e 'NCCRD_DEPLOYMENT_ENV=development' \
  -e 'NCCRD_API_NODE_ENV=development' \
  -e 'MSSQL_HOSTNAME=sql-server' \
  -e 'MSSQL_USERNAME=sa' \
  -e 'MSSQL_PASSWORD=password!123#' \
  -e 'MSSQL_DATABASE=nccrd' \
  -e 'MSSQL_PORT=1433' \
  -e 'NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES=name@email.com"' \
  -e 'NCCRD_TECHNICAL_CONTACT=other-name@email.com' \
  -e 'NCCRD_CLIENT_DEFAULT_NOTICES=Welcome to the National Climate Change Response Database!,info' \
  -p 3000:3000 \
  -d nccrd

# NCCRD_API_NODE_ENV=production is for deployment behind an SSL-offloading proxy server
```

## Deploy from published Docker image
TODO 

## Containerized deployment
TODO