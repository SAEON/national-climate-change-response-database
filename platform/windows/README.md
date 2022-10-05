
# Windows server


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Via reverse proxy](#via-reverse-proxy)
  - [Install IIS](#install-iis)
  - [Create a web.config file](#create-a-webconfig-file)
  - [Configure reverse proxies](#configure-reverse-proxies)
  - [Configure IIS to pass HTTP headers to the Node.js application](#configure-iis-to-pass-http-headers-to-the-nodejs-application)
  - [Set caching and compression](#set-caching-and-compression)
  - [Configure the Node.js application to run as a service](#configure-the-nodejs-application-to-run-as-a-service)
    - [Environment variables](#environment-variables)
    - [Alternative to NSSM](#alternative-to-nssm)
  - [Upgrading the application](#upgrading-the-application)
- [Proxy server alternatives](#proxy-server-alternatives)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Via reverse proxy

## Install IIS

Install IIS, and then install the components installer (if not already installed).

There are many ways to configure IIS to reverse proxy to the Node.js server. These instructions are for a site-level proxy. The following modules are required (that are not installed by default) and can be installed using the components installer:

- Install Application Request Routing module (ARR)
- Install the URL Rewrite module

Proxying has to be enabled at a server level (the ARR module), but individual proxy rules can be configured at at site level (using the URL Rewrite module). **I am not sure on the security considerations for this, I would recommend that IIS when configured as a proxy server only serve proxied websites.**

## Create a web.config file

Create a site in IIS and change the web.config file to look like the [example](/web.config).

## Configure reverse proxies

Open the ARR module (called "Application Request Routing Cache") and:

- Open the "Server Proxy Settings" menu from the actions panel on the right of the screen
  - Make sure that "Enable Proxy" is checked
  - Make sure that "Reverse rewrite host in response" is NOT checked
  - In the "Custom Headers" section, the default should be "X-Forwarded-For". Leave that as is, but make sure the "Include TCP port from Client IP" checkbox is NOT selected
  - Make sure that "Use URL Rewrite to inspect incoming requests is NOT selected

Then at the server level, double click the "Configuration Editor" module

- Choose system.webServer/proxy from the drop down menu
- Set "preserveHostHeader" to true

## Configure IIS to pass HTTP headers to the Node.js application

You can set HTTP headers of forwarded requests using the URL Rewrite module. This is necessary to provide the correct host context to the Node.js server. The Node.js app is deployed at localhost:3000, but the host is actually the server name. Also, the Node.js needs to know whether the incoming request to the server is via HTTP or HTTPS.

The following headers need to be set explicitly in IIS:

- HTTP_Origin
- HTTP_X-Forwarded-Proto
- HTTP_X-Forwarded-Host

IIS allows for setting server variables and HTTP headers via the same mechanism. Names prefixed with `HTTP_` are included in forwarded requests as HTTP headers, otherwise they are server variables. Server variables are not used in this deployment.

To enable the headers, in IIS in the context of the site (i.e. not the main server), just open the URL Rewrite module and add header names to the allowed server variables.

## Set caching and compression

The deployment benefits from compressing static resources (HTML, images, JS, etc.) and also by setting sensible caching policies on these resource. This is recommended.

## Configure the Node.js application to run as a service

To remove the need for constant manual management of the Node.js service, it's necessary to install the Node.js application as a Windows service. This will allow it to restart on error, and start automatically on server start. These instructions are for an open source tool called [NSSM - the Non-Sucking Service Manager](https://nssm.cc/). To configure with NSSM, follow the usage instructions [on the website](https://nssm.cc/usage). But in summary:

- Visit the [NSSM download page](https://nssm.cc/download). Note the message at the top regarding Windows Server 2016 and newer, and download [nssm 2.24.101](https://nssm.cc/ci/nssm-2.24-101-g897c7ad.zip) (or later version). Unzip the download and copy the 64 bit executable (nssm.exe in the Win64 folder) to the directory with the NCCRD Node.js application.
- Start Powershell in admin mode, and navigate to the directory with the NCCRD Node.js application.
- Run: `.\nssm.exe install nccrd`. In the UI:
  - Select the NCCRD executable as the application path
  - In the "Details" tab give a sensible display name and, optionally, a description
  - The defaults in the "Log on" tab should work fine, but it may be advisable to create a dedicated user with limited permissions (beyond scope here)
  - In the "Dependencies" tab should be fine as is (there is a dependency on SQL Server but the NCCRD will just crash and restart until SQL Server is ready)
  - The default "Process" tab values are fine
  - Create a file `console.log` in the root of directory with the NCCRD executable. In the I/O tab set the stdout and stderr path to this file, or in the "File rotation" tab set nssm to replace existing log tabs (i.e. prevent large log files)
  - Click "Install service" (there are other useful configuration options that are worth looking into, particularly log rotation)
  - In the "Environment" tab, you can specify the application environment variables (See the section below on Environment variables)
- Run: `.\nssm.exe set nccrd appnoconsole 1`
- Run: `.\nssm.exe start nccrd`

### Environment variables

Windows Server 2016 seems to allow for creating a `.env` file in the root of the directory with the NCCRD executable. However Windows Server 2019 seems to ignore this file. In this case the environment variables need to be specified to the NSSM tool. This is done via the install Wizard. There should be **NO QUOTES** wrapping the values. i.e. the input to the Environment tab should look like this:

```txt
LOG_SQL_QUERIES=false
FILES_DIRECTORY=./assets
LOG_REQUEST_DETAILS=true
DEFAULT_SYSADMIN_EMAIL_ADDRESSES=zach@saeon.ac.za
DEPLOYMENT_ENV=production
SSL_ENV=production
HOSTNAME=https://testing-nccrd-windows.saeon.ac.za
PORT=3000
ODP_AUTH_CLIENT_SECRET=secret-string
MSSQL_DATABASE=nccrd
MSSQL_HOSTNAME=localhost
MSSQL_PASSWORD=password
MSSQL_USERNAME=nccrd
```

(These will need to be specified again when upgrading the app, so it may be helpful to have them in a file - `nssm-env-vars.txt` so that the contents can be easily copy/pasted in the future)

### Alternative to NSSM

Alternatively to NSSM, here are Microsoft instructions to install services using [instsrv.exe & srvany.exe](https://docs.microsoft.com/en-US/troubleshoot/windows-client/deployment/create-user-defined-service). I think it's also possible to configure services via a Domain Controller.

## Upgrading the application

I think it's useful to name the NCCRD executable files according to version. As such, upgrading requires removing the service installed via NSSM and reinstalling another service via NSSM with a new NCCRD file.

- Stop the NSSM service: `.\nssm.exe stop nccrd`
- Remove the NSSM service: `.\nssm.exe remove nccrd`
- Copy a newer NCCRD executable into the directory
- Reinstall the NSSM service: `.\nssm.exe install nccrd` (use the new executable, and don't forget about setting the stdio and environment variables)
- Run: `.\nssm.exe set nccrd appnoconsole 1`
- Run: `.\nssm.exe start nccrd`

# Proxy server alternatives

It should also be possible to host the Node.js process directly using IIS and [iisnode](https://github.com/azure/iisnode)
