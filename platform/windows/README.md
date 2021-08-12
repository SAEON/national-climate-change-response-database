# IIS (Windows)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

- [Configure reverse proxies](#configure-reverse-proxies)
- [Add 'allowed' server variables](#add-allowed-server-variables)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Configure reverse proxies
Install the URL rewrite module, and the other one (TODO).

- Make sure that "Reverse rewrite host in response" is deselected

## Add 'allowed' server variables
In the context of the site, open the URL Rewrite module and add the following allowed server variables:

- Origin
- Host
- X-Forwarded-Proto
- X-Forwarded-Host
