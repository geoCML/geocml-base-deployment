# geoCML Base Deployment

## Introduction

This repository hosts a base geoCML deployment. A base geoCML deployment consists of the following microservices:
- geocml-desktop (the user entry point for your deployment)
- geocml-postgres
- geocml-server
- geocml-task-scheduler

Each microservice in this deployment can communicate over an internal network called geocml-network. Each microservice can be customized to fit the needs of your use case.

## How to Use this Repo

1. Clone this repo, giving the new repo a descriptive name for the workspace image to be created
1. Run `docker-compose pull` to download the image or run `docker-compose build` to build the workspace image
1. Run `docker network create geocml-network` to initialize the internal network that geoCML microservices will use to communicate with each other

## Using the image locally

Once built, the image can be run locally using docker-compose.

- **Starting the image locally:** Run `docker-compose up -d`
- **Stopping the image locally:** Run `docker-compose down`

When running locally, the geocml-desktop can be accessed via a VNC Viewer at localhost:10000
