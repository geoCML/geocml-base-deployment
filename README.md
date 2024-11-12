# geoCML Base Deployment

## Introduction

This repository hosts a base geoCML deployment. A base geoCML deployment consists of the following micro-services:
- geocml-desktop (the primary user entry point for your deployment)
- geocml-postgres (the primary data store for your deployment)
- geocml-server (the secondary user entry point for your deployment)
- geocml-task-scheduler (an automation service)

Each micro-service in this deployment can communicate over an internal network called geocml-network. Each micro-service can be customized to fit the needs of your use case.

## Quick Deployment Guide

_Get up and running with geoCML in under 15 minutes!_

geoCML deployments are multi-paradigm, offering a desktop, server, and web GIS experience with a single deployment. You may host your geoCML instance locally or in the cloud, depending on your needs.

Before instantiating a geoCML deployment, you must have Docker (https://www.docker.com/) and Docker Compose (https://docs.docker.com/compose/install/) installed on the machine you want to host geoCML on. You do not need any additional GIS software installed on the host machine. Once you have satisfied these conditions, please follow the following steps to deploy your geoCML instance.

- Clone the geoCML source code from this repository
- Open a terminal and cd into the source code directory
- Copy `.env.example` into a new file called `.env`
- Update your `.env` to include your deployment specific configuration variables
- Run `sh build.sh` to build geoCML service images on your machine
- Run `docker network create geocml-network`
- Run `sh start.sh` to bring up the instance

That's it! You can access geoCML Desktop via {deployment host URL}:10000 or geoCML Server Portal via {deployment host URL}:80 using a web browser. Further configuration steps for each of these services are discussed in later topics.

### Using hosted geoCML images from GHCR

The geoCML development team hosts pre-built containers at our container registry on Github. These containers are a great way to demo geoCML, but please note that these services are _not production ready_, because they lack the required build arguments. If you want to use geoCML in production, please build your containers.

Please keep in mind that the GEOCML_DESKTOP_PASSWORD variable in the `.env` file must be set to access your deployment via geoCML Desktop.

