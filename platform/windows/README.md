# IIS (Windows)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

- [Add 'allowed' server variables](#add-allowed-server-variables)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Add 'allowed' server variables
In the context of the site, open the URL Rewrite module and add the following allowed server variables:

- Origin
- Host
- X-Forwarded-Proto
- X-Forwarded-Host