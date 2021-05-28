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
  - [Deploy as Docker image](#deploy-as-docker-image)
  - [Deploy from published Docker image](#deploy-from-published-docker-image)
  - [Deploy using Docker-compose](#deploy-using-docker-compose)
  - [Build an executable from the source code](#build-an-executable-from-the-source-code)
- [Running the application as an executable](#running-the-application-as-an-executable)
  - [Linux & Mac](#linux--mac)
  - [Windows](#windows)
  - [With a configuration file](#with-a-configuration-file)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Quick start

Setup the repository for development on a local machine. The Node.js and React services are run using a local installation of Node.js, and dependent services (SQL Server) are run via Docker containers

## System requirements

1. Docker Desktop
2. Node.js **node:^14.17** (Versions lower than **node:14.13** will not work)

```sh
# Make sure that Node.js ^node:14.17 is installed. Follow the instructions at https://github.com/nodesource/distributions/blob/master/README.md#debinstall
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

# Start the Node.js API server
npm run start:api

# Start the React.js client
npm run start:client
```

# Deployment
This project comprises a server (Node.js application) as well as a website (React.js static files). These services are separate in terms of how the source code is laid out. Both services need to be deployed together. Node.js applications typically include an HTTP server bound to localhost, with HTTP requests proxy-passed to this localhost address. The static website first needs to be built from the source code, and then served from a webserver. Proxy-passing to a Node.js server and serving static files is fairly straightforward using Nginx, Apache, IIS, etc.

Several mechanisms are available to deploy this project from source code:

1. Install Node.js on a server, and then run the API and serve the (built) client separately
2. Build a docker image that will serve the API and client together
3. Use Docker-compose to setup a deployment that includes the API, client, and Sql Server
4. Package the API and client into a single executable that can be started on any server

## Deploy bundled API + client
The easiest way to deploy the application from source code is to serve the React.js static files from the Node.js server. Note the following:

1. API (`/http` and `/graphql`) calls are gzipped by the Node.js application, but **static files are NOT** (configure this in your webserver)
2. No caching policy is set by the Node.js server when static files are requested (also configure this in your webserver)
3. The HTTP `origin` header should be set explicitly by the proxy server and should be the domain by which the application is served from

Refer to this [this Nginx configuration file](platform/centos/nginx/nginx.conf) and [this Nginx server block](platform/centos/nginx/nccrd.conf) for an example of how to configure a webserver to set caching headers and compress static files.


To start this app in a production environment:

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
  -e 'SAEON_AUTH_CLIENT_ID=' \
  -e 'SAEON_AUTH_CLIENT_SCOPES=' \
  -e 'SAEON_AUTH_CLIENT_SECRET=' \
  -e 'NCCRD_HOSTNAME=http://localhost:3000' \
  -e 'NCCRD_DEPLOYMENT_ENV=development' \
  -e 'NCCRD_SSL_ENV=development' \
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

# NCCRD_SSL_ENV=production is for deployment behind an SSL-offloading proxy server
```

## Deploy from published Docker image
Use the same `docker run` command as specified above. Currently there is no plan to publish a public Docker image of this source code, if so this document will be updated to indicate the name of the docker image

## Deploy using Docker-compose
Refer to the [docker-compose.yml](docker-compose.yml) file for a deployment configuration that includes SQL Server, which can be used via the following command (with default configuration values defined in [docker-compose.env](docker-compose.yml)):

```sh
docker-compose --env-file docker-compose.env up -d --force-recreate --build
```

## Build an executable from the source code
```sh
# Install Node.js 14.16.x on the server (https://nodejs.org/en/)

# Clone the repository if not already done
git clone ... nccrd
cd nccrd

# Install dependencies if not already done
npm run install-dependencies

# Create the executables
npm run pkg
```

Executables for Mac, Linux and Windows will be placed in the `binaries/` folder. These executables can be started directly (see below for configuration)

# Running the application as an executable
Binary executables are built automatically for Windows, Max, and Linux on every commit to the `stable` branch. Download the latest version of the built application from [the releases page](https://github.com/SAEON/national-climate-change-systems/releases), and start the executable from a terminal. The examples below show how to start the application with the correct SQL Server configuration (and other configurable properties). Alternatively, placing a `.env` file in the same folder as the executable will result in configuring the application on startup.

## Linux & Mac
```sh
LOG_SQL_QUERIES=true \
MSSQL_DATABASE='nccrd' \
MSSQL_HOSTNAME='localhost' \
MSSQL_PASSWORD='password!123#' \
MSSQL_PORT=1433 \
MSSQL_USERNAME='sa' \
NCCRD_API_RESET_SCHEMA=false \
NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES='' \
NCCRD_DEPLOYMENT_ENV='production' \
NCCRD_SSL_ENV='development' \
NCCRD_HOSTNAME='http://localhost:3000' \
NCCRD_PORT=3000 \
SAEON_AUTH_CLIENT_SECRET='<secret>' \
nccrd-<linux or mac>
```

## Windows
Open a **powershell** terminal and run the following command:

```powershell
$env:LOG_SQL_QUERIES="true";
$env:MSSQL_DATABASE="nccrd";
$env:MSSQL_HOSTNAME="localhost";
$env:MSSQL_PASSWORD="password!123#";
$env:MSSQL_PORT="1433";
$env:MSSQL_USERNAME="sa";
$env:NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES="your-email@host.com";
$env:NCCRD_DEPLOYMENT_ENV="production";
$env:NCCRD_SSL_ENV="development";
$env:NCCRD_HOSTNAME="http://localhost:3000";
$env:NCCRD_PORT="3000";
$env:SAEON_AUTH_CLIENT_SECRET="<secret>";
.\nccrd-win.exe
```

## With a configuration file
Make sure there is a `.env` file in the same directory as the executable. Add configuration values to the file in the format below and then start the executable (double click on Windows)

```txt
LOG_SQL_QUERIES=true
MSSQL_DATABASE='nccrd'
MSSQL_HOSTNAME='localhost'
MSSQL_PASSWORD='password!123#'
MSSQL_PORT=1433
MSSQL_USERNAME='sa'
NCCRD_API_RESET_SCHEMA=false
NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES=''
NCCRD_DEPLOYMENT_ENV='production'
NCCRD_SSL_ENV='development'
NCCRD_HOSTNAME='http://localhost:3000'
NCCRD_PORT=3000
SAEON_AUTH_CLIENT_SECRET='<secret>'
```