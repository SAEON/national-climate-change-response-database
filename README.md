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
  - [Configuration](#configuration)
      - [SSL_ENV](#ssl_env)
      - [DEPLOYMENT_ENV](#deployment_env)
      - [Other vars](#other-vars)
  - [Proxy headers](#proxy-headers)
  - [Deploy bundled API + client](#deploy-bundled-api--client)
  - [Deploy as Docker image](#deploy-as-docker-image)
  - [Deploy from published Docker image](#deploy-from-published-docker-image)
  - [Deploy using Docker-compose](#deploy-using-docker-compose)
  - [Build an executable from the source code](#build-an-executable-from-the-source-code)
- [Running the application as an executable](#running-the-application-as-an-executable)
  - [With a configuration file](#with-a-configuration-file)
  - [Linux & Mac](#linux--mac)
  - [Windows](#windows)
    - [Installing the executable as a Windows service](#installing-the-executable-as-a-windows-service)
- [System migrations](#system-migrations)
- [Source code documentation](#source-code-documentation)
  - [Platform](#platform)
  - [API](#api)
  - [Client](#client)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quick start

Setup the repository for development on a local machine. The Node.js and React services are run using a local installation of Node.js, and dependent services (SQL Server) are run via Docker containers

## System requirements

1. Docker
2. Node.js **node:^16**

```sh
# Make sure that Node.js ^node:17.3 is installed. Follow the instructions at https://github.com/nodesource/distributions/blob/master/README.md#debinstall
# Assuming an Ubuntu Linux environment
curl -sL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install gcc g++ make # Required for building node-sass and other modules with native bindings
sudo apt-get install -y nodejs
```

## Install source code and dependencies

```sh
# Download the source code
git clone <repository> nccs
cd nccs

# Install package dependencies (this might take several minutes on the first run)
npm run install-dependencies
```

## Local development

```sh
# Create a Docker network
docker network create --driver bridge nccrd

# Start a Developer SQL Server instance (manually create the database)
docker run \
  --net=nccrd \
  --name sql-server \
  --restart always \
  -v /home/$USER/sql-server-data:/var/opt/mssql \
  -e 'ACCEPT_EULA=Y' \
  -e 'SA_PASSWORD=password!123#' \
  -e 'MSSQL_PID=Developer' \
  -e 'MSSQL_AGENT_ENABLED=true' \
  -p 1433:1433 \
  -d \
  mcr.microsoft.com/mssql/server:2017-latest

# Start the Node.js API server in development mode
npm run api

# Start the React.js client in development mode
npm run client
```

# Deployment

This project comprises a server (Node.js application) as well as a website (React.js static files). These services are separate in terms of how the source code is laid out. Both services need to be deployed together. Node.js applications typically include an HTTP server bound to localhost, with HTTP requests proxy-passed to this localhost address. The static website first needs to be built from the source code, and then served from a webserver. Proxy-passing to a Node.js server and serving static files is fairly straightforward using Nginx, Apache, IIS, etc. (Alternatively, it would seem that it's possible to host Node.js applications [directly in IIS](https://github.com/azure/iisnode/wiki/iisnode-releases))

Several mechanisms are available to deploy this project from source code:

1. Install Node.js on a server, and then run the API and serve the (built) client separately
2. Build a docker image that will serve the API and client together
3. Use Docker-compose to setup a deployment that includes the API, client, and Sql Server
4. Package the API and client into a single executable that can be started on any server

## Configuration

#### SSL_ENV

- `production`
- `development`

"production" is for deployment behind an SSL-offloading proxy server. In this case, incoming requests MUST have the X-Forwarded-Proto header explicitly set to "https", otherwise all server requests will fail

#### DEPLOYMENT_ENV

- `production`
- `development`

In development mode:

- Configuration secrets are logged in plain text to make debugging easier for the API
- The client configuration is logged (in production mode the client configuration is not logged at all)
- JavaScript code is NOT minified to make debugging easier
- Webpack bundling is run in development mode (the web client will theoretically be less responsive in this case)
- A number of helpful, but expensive, developer checks are performed that will greatly slow down the application (both API and client)

#### Other vars

... Please let me know if more detail is required for other variables

## Proxy headers

When deployed behind a proxy, the following headers need to be set by the public-facing webserver explicitly:

| Header            | Description                               |
| ----------------- | ----------------------------------------- |
| Origin            | The domain on which the client is served  |
| Host              | The original host of the incoming request |
| X-Forwarded-Proto | The value should be "HTTPS"               |

(There are other headers configured on the example [Nginx block](platform/centos/nginx/nccrd.conf), but they are likely not required generally).

## Deploy bundled API + client

The easiest way to deploy the application from source code is to serve the React.js static files from the Node.js server. Note the following:

1. API (`/http` and `/graphql`) calls are gzipped by the Node.js application, but **static files are NOT** (configure this in your webserver)
2. No caching policy is set by the Node.js server when static files are requested (also configure this in your webserver)
3. The HTTP `origin` header should be set explicitly by the proxy server and should be the domain by which the application is served from

Refer to this [this Nginx configuration file](platform/centos/nginx/nginx.conf) and [this Nginx server block](platform/centos/nginx/nccrd.conf) for an example of how to configure a webserver to set caching headers and compress static files. [IIS configuration instructions](platform/windows/README.md) are also included.

To start this application from source code:

```sh
# Install Node.js 16.x on the server (https://nodejs.org/en/)

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
  -e 'ODP_AUTH_CLIENT_ID=' \
  -e 'ODP_AUTH_CLIENT_SECRET=' \
  -e 'HOSTNAME=http://localhost:3000' \
  -e 'DEPLOYMENT_ENV=development' \
  -e 'FILES_DIRECTORY=' \
  -e 'SSL_ENV=development' \
  -e 'MSSQL_HOSTNAME=sql-server' \
  -e 'MSSQL_USERNAME=sa' \
  -e 'MSSQL_PASSWORD=password!123#' \
  -e 'MSSQL_DATABASE=nccrd' \
  -e 'MSSQL_PORT=1433' \
  -e 'DEFAULT_ADMIN_EMAIL_ADDRESSES=name@email.com"' \
  -e 'NCCRD_TECHNICAL_CONTACT=other-name@email.com' \
  -e 'DEFAULT_NOTICES=Welcome to the National Climate Change Response Database!,info' \
  -p 3000:3000 \
  -d nccrd
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
# Install Node.js 16.x on the server (https://nodejs.org/en/)

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

Binary executables are built automatically for Windows, Max, and Linux every time a tag is added to the repository. Download the latest version of the built application from [the releases page](https://github.com/SAEON/national-climate-change-systems/releases), and start the executable from a terminal. The examples below show how to start the application with the correct SQL Server configuration (and other configurable properties). Alternatively, placing a `.env` file in the same folder as the executable will result in configuring the application on startup.

## With a configuration file

It should be possible to specify configuration in a `.env` file in the same directory as the executable. Add configuration values to the file in the format below and then start the executable. (NOTE there is currently a bug on Windows Server 2019 where the configuration file is NOT read, in this case specify configuration as part of a Powershell script).

```txt
LOG_SQL_QUERIES=true
MSSQL_DATABASE='nccrd'
MSSQL_HOSTNAME='localhost'
MSSQL_PASSWORD='password!123#'
MSSQL_PORT=1433
MSSQL_USERNAME='sa'
FILES_DIRECTORY=''
DEFAULT_SYSADMIN_EMAIL_ADDRESSES=''
DEFAULT_ADMIN_EMAIL_ADDRESSES=''
DEPLOYMENT_ENV='development'
SSL_ENV='development'
HOSTNAME='http://localhost:3000'
PORT=3000
ODP_AUTH_CLIENT_SECRET='<secret>'
```

## Linux & Mac

```sh
LOG_SQL_QUERIES=true \
MSSQL_DATABASE='nccrd' \
MSSQL_HOSTNAME='localhost' \
MSSQL_PASSWORD='password!123#' \
MSSQL_PORT=1433 \
MSSQL_USERNAME='sa' \
FILES_DIRECTORY= \
DEFAULT_SYSADMIN_EMAIL_ADDRESSES='' \
DEFAULT_ADMIN_EMAIL_ADDRESSES='' \
DEPLOYMENT_ENV='development' \
SSL_ENV='development' \
HOSTNAME='http://localhost:3000' \
PORT=3000 \
ODP_AUTH_CLIENT_SECRET='<secret>' \
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
$env:FILES_DIRECTORY="./assets";
$env:DEFAULT_SYSADMIN_EMAIL_ADDRESSES="your-email@host.com";
$env:DEFAULT_ADMIN_EMAIL_ADDRESSES="your-email2@host.com";
$env:DEPLOYMENT_ENV="development";
$env:SSL_ENV="development";
$env:HOSTNAME="http://localhost:3000";
$env:PORT="3000";
$env:ODP_AUTH_CLIENT_SECRET="<secret>";
.\nccrd-win.exe
```

### Installing the executable as a Windows service

Please see the [Windows platform installation instructions](platform/windows/) for installing the NCCRD as a service (i.e. it will start on server startup, and also restart on error).

# System migrations

Moving a deployment from one system to another is fairly straightforward - just move the application server, restore the database and update configuration. However there is are a couple caveats:

1. Don't forget to move the uploads directory to the environment! Look at the configuration value `FILES_DIRECTORY` on your current deployment to see where files are uploaded to
2. **file uploads are referenced in SQL Server via absolute paths. As such, you will need to update the file paths referenced in Sql Server**

# Source code documentation

## Platform

[platform/README.md](platform/)

## API

[src/api/README.md](src/api/)

## Client

[src/client/README.md](src/client/)
