#!/bin/bash

VERSION=v4.0
DOCKER_COMPOSE_PATH=$(dirname $(find $(pwd) -name "docker-compose.yml"))

function spinner() {
  local frames=(".   🌎" "..  🌍" "... 🌏")
  local i=0
  while true; do
    printf "\rWorking${frames[$i]}"
    i=$(( (i+1) % ${#frames[@]} ))
    sleep 1
  done
}

command -v docker

if [[ $? -ne 0 ]]; then
    echo "Error: Docker is not installed on this machine."
    exit 1
fi

command -v git

if [[ $? -ne 0 ]]; then
    echo "Error: git is not installed on this machine."
    exit 1
fi

clear
echo "Welcome to geoCML $VERSION!"

if [ "$GEOCML_DEPLOYMENT_NAME" == "" ]
then
    printf "\nPlease enter the name you want to use to for this deployment.\n"
    echo "(This will create a folder for your geoCML deployment at $HOME)"
    read GEOCML_DEPLOYMENT_NAME
    export GEOCML_DEPLOYMENT_NAME=$GEOCML_DEPLOYMENT_NAME
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_DEPLOYMENT_NAME ~/.bashrc; then
        echo "[INFO] Updating GEOCML_DEPLOYMENT_NAME in your bash profile."
        sed -i '' 's/export GEOCML_DEPLOYMENT_NAME=.*/export GEOCML_DEPLOYMENT_NAME='$GEOCML_DEPLOYMENT_NAME'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_DEPLOYMENT_NAME=$GEOCML_DEPLOYMENT_NAME" >> ~/.bashrc
    fi
fi


if [ "$GEOCML_DESKTOP_PASSWORD" == "" ]
then
    printf "\nPlease enter the password you want to use to access geoCML Desktop.\n"
    read GEOCML_DESKTOP_PASSWORD
    export GEOCML_DESKTOP_PASSWORD=$GEOCML_DESKTOP_PASSWORD
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_DESKTOP_PASSWORD ~/.bashrc; then
        echo "[INFO] Updating GEOCML_DESKTOP_PASSWORD in your bash profile."
        sed -i '' 's/export GEOCML_DESKTOP_PASSWORD=.*/export GEOCML_DESKTOP_PASSWORD='$GEOCML_DESKTOP_PASSWORD'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_DESKTOP_PASSWORD=$GEOCML_DESKTOP_PASSWORD" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_POSTGRES_ADMIN_PASSWORD" == "" ]
then
    printf "\nPlease enter the administrator password you want to use to access geoCML Postgres.\n"
    read GEOCML_POSTGRES_ADMIN_PASSWORD
    export GEOCML_POSTGRES_ADMIN_PASSWORD=$GEOCML_POSTGRES_ADMIN_PASSWORD
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_POSTGRES_ADMIN_PASSWORD ~/.bashrc; then
        echo "[INFO] Updating GEOCML_POSTGRES_ADMIN_PASSWORD in your bash profile."
        sed -i '' 's/export GEOCML_POSTGRES_ADMIN_PASSWORD=.*/export GEOCML_POSTGRES_ADMIN_PASSWORD='$GEOCML_POSTGRES_ADMIN_PASSWORD'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_POSTGRES_ADMIN_PASSWORD=$GEOCML_POSTGRES_ADMIN_PASSWORD" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_POSTGRES_PASSWORD" == "" ]
then
    printf "\nPlease enter the password you want to use to access geoCML Postgres with user 'geocml'.\n"
    read GEOCML_POSTGRES_PASSWORD
    export GEOCML_POSTGRES_PASSWORD=$GEOCML_POSTGRES_PASSWORD
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_POSTGRES_PASSWORD ~/.bashrc; then
        echo "[INFO] Updating GEOCML_POSTGRES_PASSWORD in your bash profile."
        sed -i '' 's/export GEOCML_POSTGRES_PASSWORD=.*/export GEOCML_POSTGRES_PASSWORD='$GEOCML_POSTGRES_PASSWORD'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_POSTGRES_PASSWORD=$GEOCML_POSTGRES_PASSWORD" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_POSTGRES_PORT" == "" ]
then
    printf "\nPlease enter the port you want to use to access geoCML Postgres.\n"
    read GEOCML_POSTGRES_PORT
    export GEOCML_POSTGRES_PORT=$GEOCML_POSTGRES_PORT
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_POSTGRES_PORT ~/.bashrc; then
        echo "[INFO] Updating GEOCML_POSTGRES_PORT in your bash profile."
        sed -i '' 's/export GEOCML_POSTGRES_PORT=.*/export GEOCML_POSTGRES_PORT='$GEOCML_POSTGRES_PORT'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_POSTGRES_PORT=$GEOCML_POSTGRES_PORT" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_DESKTOP_PORT" == "" ]
then
    printf "\nPlease enter the port you want to use to access geoCML Desktop.\n"
    read GEOCML_DESKTOP_PORT
    export GEOCML_DESKTOP_PORT=$GEOCML_DESKTOP_PORT
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_DESKTOP_PORT ~/.bashrc; then
        echo "[INFO] Updating GEOCML_DESKTOP_PORT in your bash profile."
        sed -i '' 's/export GEOCML_DESKTOP_PORT=.*/export GEOCML_DESKTOP_PORT='$GEOCML_DESKTOP_PORT'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_DESKTOP_PORT=$GEOCML_DESKTOP_PORT" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_SERVER_PORT" == "" ]
then
    printf "\nPlease enter the port you want to use to access geoCML Server.\n"
    read GEOCML_SERVER_PORT
    export GEOCML_SERVER_PORT=$GEOCML_SERVER_PORT
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_SERVER_PORT ~/.bashrc; then
        echo "[INFO] Updating GEOCML_SERVER_PORT in your bash profile."
        sed -i '' 's/export GEOCML_SERVER_PORT=.*/export GEOCML_SERVER_PORT='$GEOCML_SERVER_PORT'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_SERVER_PORT=$GEOCML_SERVER_PORT" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_NETWORK_NAME" == "" ]
then
    printf "\nPlease enter the name you want to use for the geoCML network.\n"
    read GEOCML_NETWORK_NAME
    export GEOCML_NETWORK_NAME=$GEOCML_NETWORK_NAME
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_NETWORK_NAME ~/.bashrc; then
        echo "[INFO] Updating GEOCML_NETWORK_NAME in your bash profile."
        sed -i '' 's/export GEOCML_NETWORK_NAME=.*/export GEOCML_NETWORK_NAME='$GEOCML_NETWORK_NAME'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "export GEOCML_NETWORK_NAME=$GEOCML_NETWORK_NAME" >> ~/.bashrc
    fi
fi


if [ "$GEOCML_INSTALLATION_METHOD" == "" ]
then
    printf "\nPlease select how you want to install geoCML to this machine.\n"
    echo "1) Pull Docker image from GHCR (recommended)"
    echo "2) Build Docker image locally from source"
    read GEOCML_INSTALLATION_METHOD
fi


mkdir ~/$GEOCML_DEPLOYMENT_NAME &> /dev/null
if [ $? -ne 0 ]
then
    printf "\n[ERROR]: ~/$GEOCML_DEPLOYMENT_NAME is not empty.\n"
    echo "Can I delete the directory at $HOME/$GEOCML_DEPLOYMENT_NAME?"
    echo "(yes/no)"
    read RM_PROJECT_DIR

    if [ "$RM_PROJECT_DIR"  == "yes" ]
    then
        echo "[INFO]: Removing directory at $HOME/$GEOCML_DEPLOYMENT_NAME"
        rm -rf ~/$GEOCML_DEPLOYMENT_NAME
        mkdir ~/$GEOCML_DEPLOYMENT_NAME &> /dev/null
    else
        echo "[ERROR]: Cannot create a geoCML deployment in a non-empty directory."
        exit 1
    fi
fi

mkdir /tmp/geocml/ &> /dev/null
mkdir /tmp/geocml/logs &> /dev/null

if [ "$DOCKER_COMPOSE_PATH" == "" ]
then
    printf "\n[WARN]: It looks like this install script was run outside of the geoCML Base Deployment repository...\n"
    printf "\n[INFO]: Cloning into /tmp/geocml-base-deployment.\n"
    git clone https://github.com/geoCML/geocml-base-deployment.git /tmp/geocml/geocml-base-deployment/ &> /tmp/geocml/logs/build.log
    cd /tmp/geocml/geocml-base-deployment/ &> /tmp/geocml/logs/build.log
    git fetch --tags --all &> /tmp/geocml/logs/build.log
    git checkout tags/$VERSION &> /tmp/geocml/logs/build.log
    DOCKER_COMPOSE_PATH=/tmp/geocml/geocml-base-deployment/
fi

cp -r $DOCKER_COMPOSE_PATH/. ~/$GEOCML_DEPLOYMENT_NAME &> /tmp/geocml/logs/build.log
cd ~/$GEOCML_DEPLOYMENT_NAME/ &> /tmp/geocml/logs/build.log

if [ "$GEOCML_INSTALLATION_METHOD" == "1" ]
then
    echo "Okay, geoCML will be installed by pulling the Docker image from GHCR."
    printf "\n[INFO]: Pulling geoCML...\n"

    spinner &
    spinner_pid=$!
    docker compose pull &> /tmp/geocml/logs/build.log
    printf "\n[INFO]: Finished pulling containers from GHCR.\n"
elif [ "$GEOCML_INSTALLATION_METHOD" == "2" ]
then
    echo "Okay, geoCML will be installed by building the containers locally from source."
    printf "\n[INFO]: Building geoCML...\n"

    spinner &
    spinner_pid=$!
    docker compose build &> /tmp/geocml/logs/build.log
    printf "\n[INFO]: Finished building.\n"
else
    echo "No idea what $GEOCML_INSTALLATION_METHOD means! Please provide a valid installation method (1, 2). Exiting."
    kill $spinner_pid
    wait $spinner_pid 2>/dev/null
    exit 1
fi

echo "[INFO]: Check /tmp/logs/geocml/build.log for additional information about your build!"

echo "[INFO] Starting geoCML..."

docker network create $GEOCML_NETWORK_NAME &> /tmp/geocml/logs/start.log
docker compose down &> /tmp/geocml/logs/start.log
docker compose up -d --wait &> /tmp/geocml/logs/start.log
kill $spinner_pid
wait $spinner_pid 2>/dev/null
printf "\n[INFO]: Finished startup.\n"
echo "[INFO]: Check /tmp/logs/geocml/start.log for additional information about your deployment!"
exit 0
