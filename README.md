# National Climate Change Response Database (NCCRD)
A database for tracking, analysing, and monitoring climate adaptation and mitigation projects

# README Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Quick start](#quick-start)
  - [System requirements](#system-requirements)
  - [Install source code and dependencies](#install-source-code-and-dependencies)
  - [Local development](#local-development)
    - [Build an executable from the source code](#build-an-executable-from-the-source-code)
- [Deployment](#deployment)
  - [Proxy headers](#proxy-headers)
  - [Deploy bundled API + client](#deploy-bundled-api--client)
  - [Deploy as Docker image](#deploy-as-docker-image)
  - [Deploy via the released executable](#deploy-via-the-released-executable)
    - [Linux & Mac](#linux--mac)
    - [Windows](#windows)
      - [Installing the executable as a Windows service](#installing-the-executable-as-a-windows-service)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
    - [SSL_ENV](#ssl_env)
    - [DEPLOYMENT_ENV](#deployment_env)
    - [Other vars](#other-vars)
  - [Using a configuration file](#using-a-configuration-file)
- [System migrations](#system-migrations)
- [Source code documentation](#source-code-documentation)
  - [Platform](#platform)
  - [API](#api)
  - [Client](#client)
  - [Nginx](#nginx)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quick start

Setup the repository for development on a local machine. The Node.js and React services are run using a local installation of Node.js, and dependent services (SQL Server) are run via Docker containers

## System requirements

1. Docker
2. Node.js **node:^16**

```sh
# Make sure that Node.js 16 is installed. Follow the instructions at https://github.com/nodesource/distributions/blob/master/README.md#debinstall.
# Assuming an Ubuntu Linux environment
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install gcc g++ make # Required for building node-sass and other modules with native bindings
sudo apt-get install -y nodejs
```

## Install source code and dependencies

```sh
# Download the source code
git clone <repository> nccs
cd nccs

# Install package dependencies (this might take several minutes on the first run)
# This command occasionally fails (don't know why). If so, run "npm install" in the root folder, src/api, and src/client
npm run install-dependencies
```

## Local development

```sh
# Create a Docker network
docker network create --driver bridge nccrd

# Start a Developer SQL Server instance (manually create the database)
mkdir /home/$USER/sql-server-data
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

### Setup the NCCRD database
# (1) Then log in to SQL Server using SA creds (sa / password!123#)
# (2) Make sure the system database "model" is set to recovery model = simple (to avoid large, unecessary log files)
# (3) Create a database called "nccrd" with "SIMPLE" recovery mode (should be default if you set the model DB to SIMPLE)

### Configure API and client environment variables and adjust values accordingly
cp src/api/.env.example src/api/.env
cp src/client/.env.example src/client/.env

# Start the Node.js API server in development mode
npm run api

# Start the React.js client in development mode
npm run client
```

### Build an executable from the source code

This is done on release via the GitHub actions workflow. This is how to do it manually

```sh
# Install Node.js 16.x on the server (https://nodejs.org/en/)

# Clone the repository if not already done
git clone ... nccrd
cd nccrd

# Install dependencies if not already done
# This sometimes fails - I don't know why. If it fails, run the command "npm install" from /src/api, src/client, and the current directory
npm run install-dependencies

# Create the executables
npm run pkg
```

Executables for Mac, Linux and Windows will be placed in the `binaries/` folder. These executables can be started directly (see below for configuration)

# Deployment

This project comprises a server (Node.js application) as well as a website (React.js static files). These services are separate in terms of how the source code is laid out. Both services need to be deployed together. Node.js applications typically include an HTTP server bound to localhost/0.0.0.0, with HTTP requests proxy-passed to this address (note the HTTP headers mentioned below - the proxy server needs to set these explicitly)

Configuring a proxy server for a Node.js deployment is fairly straightforward using Nginx, Apache, IIS, etc. (Alternatively, it would seem that it's possible to host Node.js applications [directly in IIS](https://github.com/azure/iisnode/wiki/iisnode-releases))

Server setup instructions are included in this repository:

- [platform/windows](Windows)
- [platform/centos](CentOS 7.6)

## Proxy headers

When deployed behind a proxy (usually the case for Node.js HTTP APIs), the following headers need to be set by the public-facing webserver explicitly.

| Header            | Description                               |
| ----------------- | ----------------------------------------- |
| Origin            | The domain on which the client is served  |
| Host              | The original host of the incoming request |
| X-Forwarded-Proto | The value should be "HTTPS"               |

For an example of setting HTTP headers using Nginx, refer to [the Nginx server block](src/nginx/conf.d/nccrd.conf) used to host this application at SAEON.

## Deploy bundled API + client

The easiest way to deploy the application from source code is to serve the React.js static files from the Node.js server. Note the following:

1. API (`/http` and `/graphql`) calls are gzipped by the Node.js application, but **static files are NOT** (configure this in your webserver)
2. No caching policy is set by the Node.js server when static files are requested (also configure this in your webserver - for an example see [this Nginx configuration](src/nginx/nginx.conf))

To start this application from source code:

```sh
# Install Node.js 16.x on the server (https://nodejs.org/en/)

# Clone the repository if not already done
git clone ... nccrd
cd nccrd

# Install dependencies if not already done
# This sometimes fails - I don't know why. If it fails, run the command "npm install" from /src/api, src/client, and the current directory
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

## Deploy via the released executable

Binary executables are built automatically for Windows, Max, and Linux every time a tag is added to the repository. Download the latest version of the built application from [the releases page](https://github.com/SAEON/national-climate-change-systems/releases), and start the executable from a terminal window (this is preferable to double clicking the executable, as you will see logs when the application exits).

### Linux & Mac

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

### Windows

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

#### Installing the executable as a Windows service

Please see the [Windows platform installation instructions](platform/windows/) for installing the NCCRD as a service (i.e. it will start on server startup, and also restart on error).

# Configuration

The application reads environment variables on startup and caches the environment variables within application memory (using sensible defaults that are suited to development with no configuration specified). To configure the application, set environment variables and then start the application.

## Environment variables

The full list of environment variables can be found in the source code (`src/api/src/config` for the API, and `src/client/src/config.js` for the client).

### SSL_ENV

- `production`
- `development`

"production" is for deployment behind an SSL-offloading proxy server. In this case, incoming requests MUST have the X-Forwarded-Proto header explicitly set to "https", otherwise all server requests will fail

### DEPLOYMENT_ENV

- `production`
- `development`

In development mode:

- Configuration secrets are logged in plain text to make debugging easier for the API
- The client configuration is logged (in production mode the client configuration is not logged at all)
- JavaScript code is NOT minified to make debugging easier
- Webpack bundling is run in development mode (the web client will theoretically be less responsive in this case)
- A number of helpful, but expensive, developer checks are performed that will greatly slow down the application (both API and client)

### Other vars

... Please let me know if more information is required for other environment variables

## Using a configuration file

- Specify environment variable configuration in `src/api/.env` for the API (refer to `src/api/.env.example` for an example file)
- Specify environment variable configuration in `src/client/.env` for the client (refer to `src/client/.env.example` for an example file). Unlike the API, which will reload the `.env` file on every application start, the client reads the `.env` file once at build time. Restart the client application to update configuration.

NOTE there is currently a bug on Windows Server 2019 where the configuration file is **_NOT_** read on startup. In this case specify configuration as part of a Powershell script as shown above.

## Configuring the database
Configure database connections using environment variables as explained above. Don't forget to configure to take regular backups!

### Backing up the database via T-SQL
Using SQL Server via a Dockerized Linux deployment (as configured on the SAEON platform), configure scheduled backups using `sqlcmd`. The command below works in a development (localhost) environment if setup as outlined above.

```sh
docker run \
  --net=nccrd \
  -v /home/$USER/sql-server-data:/var/opt/mssql \
  -e 'ACCEPT_EULA=Y' \
  -e 'SA_PASSWORD=password!123#' \
  -e 'MSSQL_PID=Express' \
  -e 'MSSQL_AGENT_ENABLED=true' \
  --rm mcr.microsoft.com/mssql/server:2017-latest \
  sh -c \
    "/opt/mssql-tools/bin/sqlcmd \
      -S sql-server \
      -d nccrd \
      -U sa \
      -P 'password!123#' \
      -Q \" \
        declare @db nvarchar(256); \
        declare @path nvarchar(512); \
        declare @filename nvarchar(512); \
        declare @filedate nvarchar(40); \
        set @path = '/var/opt/mssql/bak/'; \
        set @db = 'nccrd'; \
        select @filedate = convert(nvarchar(20), getdate(), 112); \
        set @filename = @path + @db + '_' + @filedate + '.bak'; \
        backup database @db to disk = @filename;\""
```

Since crontab doesn't support multiline commands, to run this command on a scheduled basis via a cronjob:

```sh
sudo su
cd /path/to/script.sh
touch script.sh
chmod +x script.sh

# Copy the command above (with correct username/password/etc) into script.sh

sudo crontab -e

# Add the following to the file and save (to run a backup at 0400 every day):
0 4 * * * /path/to/script.sh >> /path/to/logfile.log 2>&1
```

# System migrations

Moving a deployment from one system to another is fairly straightforward - just deploy to a new server, restore the database and update configuration. However there is are a couple caveats:

1. Don't forget to move the uploads directory to the environment! Look at the configuration value `FILES_DIRECTORY` on your current deployment to see where files are uploaded to
2. **file uploads are referenced in SQL Server via absolute paths. As such, you will need to update the file paths referenced in Sql Server**

# Source code documentation

## Platform

[platform/README.md](platform/)

## API

[src/api/README.md](src/api/)

## Client

[src/client/README.md](src/client/)

## Nginx

[src/nginx/README.md](src/nginx/)
