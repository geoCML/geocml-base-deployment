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

Before instantiating a geoCML deployment, you must have git (https://git-scm.com/downloads), Docker (https://www.docker.com/), and Docker Compose (https://docs.docker.com/compose/install/) installed on the machine you want to host geoCML on. You do not need any additional GIS software installed on the host machine. Once you have satisfied these conditions, please follow the following steps to deploy your geoCML instance.

- In your favorite terminal, run the following command: `sh <(curl https://raw.githubusercontent.com/geocml/geocml-base-deployment/main/install.sh)`
- Follow the on-screen prompts to configure and deploy a geoCML instance to your machine.

That's it! You can access geoCML Desktop via {deployment host URL}:10000 or geoCML Server Portal via {deployment host URL}:80 using a web browser. Further configuration steps for each of these services are discussed in our documentation (https://geocml.github.io/docs/).

