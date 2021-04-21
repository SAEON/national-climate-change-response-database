# national-climate-change-systems
Suite of services - for tracking, analysing, and monitoring climate adaptation and mitigation projects

# README Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Quick start](#quick-start)
  - [System requirements](#system-requirements)
  - [Install source code and dependencies](#install-source-code-and-dependencies)
  - [Local development](#local-development)

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

# Update repository git configuration
npm run configure-git

# Install package dependencies (this might take several minutes on the first run)
npm run install-dependencies

# Build local packages
npm run build-all-packages
```

## Local development

```sh
# Start a MongoDB server
docker run --name mongo --restart always -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -d -p 27017:27017 mongo:4.4.3

# Start the Node.js API server
npm run start:api

# Start the React.js client
npm run start:client
```