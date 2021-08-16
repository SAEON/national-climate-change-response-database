# IIS (Windows)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

- [Install IIS](#install-iis)
- [Create a web.config file](#create-a-webconfig-file)
- [Configure reverse proxies](#configure-reverse-proxies)
- [Configure IIS to pass HTTP headers to the Node.js application](#configure-iis-to-pass-http-headers-to-the-nodejs-application)
- [Set caching and compression](#set-caching-and-compression)
- [Configure the Node.js application to run as a service](#configure-the-nodejs-application-to-run-as-a-service)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
todo
