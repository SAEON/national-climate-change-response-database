# NCCRD Client

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Developer documentation](#developer-documentation)
  - [Authentication gotcha's](#authentication-gotchas)
- [Request more info!](#request-more-info)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Developer documentation
The NCCRD client is configured to be developed as a standalone SPA (single page application) via the webpack plugin ecosystem, whereas for deployment the SPA is bundled as static assets and served via the API. 

### Authentication gotcha's
In development the API and client have different origins, whereas in production they have the same origin. This has implication for CORS - specifically there are some 'gotcha's due to the nature of how browsers treat origin servers when working with authentication:

- When working in the context of a tenant, set the `HOSTNAME` variable (in the client .env file only) to the domain of the tenant and make sure that the server is accessible via that hostname. In production the client will automatically configure the `HOSTNAME` variable to be the origin web address. This doesn't work in development since the API and client are served on different ports. This is necessary for authentication to work correctly on the tenant during development
- The deployed application is available on `HTTPS` (port 443). Using `new URL(...).port` will give a blank string for a port if the default port for a protocol is defined. However, in development the API is made available via port `3000` and the client on port `3001`. Ideally configuration would always be configured using ports explicitly (i.e. `https://your.domain.com:443/http/authenticate/redirect/saeon`), but the logic of specifying that URL is different to when configuring authentication on localhost. As such, localhost authentication requires specifying ports, whereas production deployment authentication deployment does not. This mostly refers to configuring 3rd party Oauth providers, but there are places in the code where it's helpful to know this.

There are other interesting problems that arise due to the difference in how browsers (specifically Chrome) treat the development domains `localhost`, `something.dvn` vs 'real' domains regarding encryption. But I can't think offhand if that has any bearing on this code base.

## Request more info!

The client is a React.js application. If you would like more information regarding this, please submit an issue and this README will be extended.
