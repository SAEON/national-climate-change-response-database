# National Climate Change Response Database (NCCRD)

A database for tracking, analysing, and monitoring climate adaptation and mitigation projects

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Quick start](#quick-start)
  - [Install source code and dependencies](#install-source-code-and-dependencies)
  - [SQL Server setup](#sql-server-setup)
  - [Create a database](#create-a-database)
  - [Start the application](#start-the-application)
  - [Configure authentication](#configure-authentication)
  - [Create a tenant (GeoFenced sub-deployment)](#create-a-tenant-geofenced-sub-deployment)
    - [Configure tenant authentication](#configure-tenant-authentication)
- [Deployment](#deployment)
  - [Proxy headers](#proxy-headers)
  - [Deploy bundled API + client](#deploy-bundled-api--client)
  - [Deploy as Docker image](#deploy-as-docker-image)
  - [Deploy via the released executable](#deploy-via-the-released-executable)
    - [Build an executable from the source code](#build-an-executable-from-the-source-code)
    - [Linux & Mac](#linux--mac)
    - [Windows](#windows)
      - [Installing the executable as a Windows service](#installing-the-executable-as-a-windows-service)
  - [Continuous Deployment](#continuous-deployment)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
    - [SSL_ENV](#ssl_env)
    - [DEPLOYMENT_ENV](#deployment_env)
    - [Other vars](#other-vars)
  - [Using a configuration file](#using-a-configuration-file)
  - [Configuring the database](#configuring-the-database)
    - [Backing up the database via T-SQL](#backing-up-the-database-via-t-sql)
- [System migrations](#system-migrations)
- [Source code documentation](#source-code-documentation)
  - [Platform](#platform)
  - [API](#api)
  - [Client](#client)
  - [Nginx](#nginx)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quick start
The application runtime is Node.js v16.14.2. Local development assumes a Linux environment with administrator access to a SQL Server instance. 

## Install source code and dependencies

```sh
# Download the source code and install dependencies
git clone git@github.com:SAEON/national-climate-change-response-database.git nccrd
cd nccrd
npm install
npm --prefix src/api install
npm --prefix src/client install
```

## SQL Server setup
The easiest way to quickly set up a SQL Server instance is via [Docker Engine](https://docs.docker.com/engine/) and using a Developer/Express license. It is also necessary to install [SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (SSMS) to configure the database server and database.

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
```

## Create a database

1. Log in to SQL Server via SSMS using `sa` credentials (sa / password!123#, if you used the command above)
2. (Optionally) set the system database "model" recovery model to `simple` (to avoid large, unnecessary log files)
3. Create a database called "nccrd" with "SIMPLE" recovery mode (should be default if you set the model DB to SIMPLE)

## Start the application

The application comprises an API (Node.js server) and client (website). These need to be started separately for development, but can be deployed together.

```sh
# Open a terminal window, and from the repository root:
cd src/api
npm run api

# Open another terminal window, and from the repository root:
cd src/client
npm run client
```

## Configure authentication

The application supports OAuth 2 authentication. Theoretically any OAuth 2 provider can be used, but in practice I have found that different OAuth 2 providers - Auth0, Google, Twitter, ORY (SAEON's implementation) require minor changes to source code for specifying/handling callback state. As such only SAEON's OAuth 2 system is directly supported. For new deployments / development environments it is necessary to request that SAEON register your application. These are the details required

```json
{
  "client_id":"SAEON.YOUR_APP",
  "redirect_uris":[
     "http://localhost:3000/http/authenticate/redirect/saeon",
     "https://<hostname>/http/authenticate/redirect/saeon"
  ],
  "grant_types":[
     "authorization_code",
     "refresh_token"
  ],
  "response_types":[
     "code"
  ],
  "scope":"openid offline SAEON.YOUR_APP",
  "post_logout_redirect_uris":[
     "http://localhost:3000/http/logout",
     "https://<hostname>/http/logout"
  ]
}
```

## Create a tenant (GeoFenced sub-deployment)

Navigate to `/deployment`, and click the `ADD TENANT` button. For local development you should use `something.localhost` as the hostname, and you may have to configure your machine's host file so requests to `something.localhost` are resolved correctly to the development server (`http://something.localhost => localhost`). For deployment, after specifying a new tenant the webserver needs to be configured to support that additional domain resolution, and authentication needs to be configured with that new domain.

### Configure tenant authentication
The Oauth 2 registration needs to be updated with additional `redirect_uris` and `post_logout_redirect_uris` uris. For example, to register a new client on the subdomain `new-tenant`, the following URIs need to be added:

**`redirect_uris`**
```txt
http://new-tenant.localhost:3000/http/authenticate/redirect/saeon
https://new-tenant.<hostname>/http/authenticate/redirect/saeon
```

**`post_logout_redirect_uris`**
```txt
http://new-tenant.localhost:3000/http/logout
https://new-tenant.<hostname>/http/logout
```

# Deployment

This project comprises a server (Node.js application) as well as a website (React.js static files). These services are separate in terms of how the source code is laid out. Both services need to be deployed together. Node.js applications typically include an HTTP server bound to localhost/0.0.0.0, with HTTP requests proxy-passed to this address (note the HTTP headers mentioned below - the proxy server needs to set these explicitly)

Configuring a proxy server for a Node.js deployment is fairly straightforward using Nginx, Apache, IIS, etc. (Alternatively, it would seem that it's possible to host Node.js applications [directly in IIS](https://github.com/azure/iisnode/wiki/iisnode-releases))

Server setup instructions are included in this repository:

- [Windows](platform/windows)
- [CentOS 7.6](platform/centos)

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

To start this application from source code, download the source code and install dependencies as outlined above. Then from the root of the repository run `npm run start:bundled`.

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

Binary executables are built automatically for Windows, Mac, and Linux every time a tag is added to the repository. Download the latest version of the built application from [the releases page](https://github.com/SAEON/national-climate-change-systems/releases), and start the executable from a terminal window (this is preferable to double clicking the executable, as you will see logs when the application exits).

### Build an executable from the source code

This is done on release via the GitHub actions workflow. To do it manually, download the source code and install dependencies as outlined above. Then from the root of the repository run `npm run pkg`.

Executables for Mac, Linux and Windows will be placed in the `binaries/` folder. These executables can be started directly (see below for configuration)

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
& '.\nccrd-win.exe'
```

#### Installing the executable as a Windows service

Please see the [Windows platform installation instructions](platform/windows/) for installing the NCCRD as a service (i.e. it will start on server startup, and also restart on error).

## Continuous Deployment
Continuous integration and deployment (CICD) refers to environments where source code changes are automatically merged and deployed to testing, staging, and production servers. 

This repository is configured to automatically deploy source code changes on the `next` branch to a testing/staging environment, and to automatically deploy to production when commits are tagged. GitHub Actions tooling (part of the [github.com](https://github.com) platform) is used for this. Refer to [workflow files](/.github/workflows/) where this logic is laid out.

Refer to [deploy_nccrd.sign-on.co.za.yml](/.github/workflows/deploy_nccrd.sign-on.co.za.yml) for an example CICD workflow with reference to [CentOS 7](/platform/centos) environment. The GitHub Actions tooling is also supported on Windows Server, so a similar deployment pipeline can also be achieved.


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
- Webpack bundling is run in development mode (the web client will execute slower and be be less responsive compared to bundling in production mode)
- A number of helpful, but expensive, developer checks are performed that will greatly slow down the application (both API and client)

### Other vars

... Please let me know if more information is required for other environment variables

## Using a configuration file

- Specify environment variable configuration in `src/api/.env` for the API (refer to `src/api/.env.example` for an example file)
- Specify environment variable configuration in `src/client/.env` for the client (refer to `src/client/.env.example` for an example file). Unlike the API, which will reload the `.env` file on every application start, the client reads the `.env` file once at build time. Restart the client application to update configuration.

NOTE: I noticed that on Windows Server 2019 the configuration file is **_NOT_** read on startup. In this case specify configuration via Powershell instead of using a `.env` file.

## Configuring the database

Configure database connections using environment variables as explained above. Don't forget to configure to take regular backups!

### Backing up the database via T-SQL

Using SQL Server via a Dockerized Linux deployment (as configured on the SAEON platform), configure scheduled backups using `sqlcmd`. The command below works in a development (localhost) environment if setup as outlined above (note that `with compression` is not supported on SQL Server Express license).

```sh
docker run \
  --net=nccrd \
  -v /home/$USER/sql-server-data:/var/opt/mssql \
  -e 'ACCEPT_EULA=Y' \
  -e 'SA_PASSWORD=password!123#' \
  -e 'MSSQL_PID=Developer' \
  -e 'MSSQL_AGENT_ENABLED=false' \
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
        backup database @db to disk = @filename with compression;\""
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

Moving a deployment from one system to another is fairly straightforward - just deploy to a new server, restore the database and update configuration. However there are a couple caveats:

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
