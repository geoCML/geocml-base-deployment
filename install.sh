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
    echo "\nPlease enter the name you want to use to for this deployment."
    echo "(This will create a folder for your geoCML deployment in $HOME)"
    read GEOCML_DEPLOYMENT_NAME
    export GEOCML_DEPLOYMENT_NAME=$GEOCML_DEPLOYMENT_NAME
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_DEPLOYMENT_NAME ~/.bashrc; then
        echo "[INFO] Updating GEOCML_DEPLOYMENT_NAME in your bash profile."
        sed -i '' 's/GEOCML_DEPLOYMENT_NAME=.*/GEOCML_DEPLOYMENT_NAME='$GEOCML_DEPLOYMENT_NAME'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "GEOCML_DEPLOYMENT_NAME=$GEOCML_DEPLOYMENT_NAME" >> ~/.bashrc
    fi
fi


if [ "$GEOCML_DESKTOP_PASSWORD" == "" ]
then
    echo "\nPlease enter the password you want to use to access geoCML Desktop."
    read GEOCML_DESKTOP_PASSWORD
    export GEOCML_DESKTOP_PASSWORD=$GEOCML_DESKTOP_PASSWORD
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_DESKTOP_PASSWORD ~/.bashrc; then
        echo "[INFO] Updating GEOCML_DESKTOP_PASSWORD in your bash profile."
        sed -i '' 's/GEOCML_DESKTOP_PASSWORD=.*/GEOCML_DESKTOP_PASSWORD='$GEOCML_DESKTOP_PASSWORD'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "GEOCML_DESKTOP_PASSWORD=$GEOCML_DESKTOP_PASSWORD" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_POSTGRES_ADMIN_PASSWORD" == "" ]
then
    echo "\nPlease enter the administrator password you want to use to access geoCML Postgres."
    read GEOCML_POSTGRES_ADMIN_PASSWORD
    export GEOCML_POSTGRES_ADMIN_PASSWORD=$GEOCML_POSTGRES_ADMIN_PASSWORD
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_POSTGRES_ADMIN_PASSWORD ~/.bashrc; then
        echo "[INFO] Updating GEOCML_POSTGRES_ADMIN_PASSWORD in your bash profile."
        sed -i '' 's/GEOCML_POSTGRES_ADMIN_PASSWORD=.*/GEOCML_POSTGRES_ADMIN_PASSWORD='$GEOCML_POSTGRES_ADMIN_PASSWORD'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "GEOCML_POSTGRES_ADMIN_PASSWORD=$GEOCML_POSTGRES_ADMIN_PASSWORD" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_POSTGRES_PASSWORD" == "" ]
then
    echo "\nPlease enter the password you want to use to access geoCML Postgres with user 'geocml'."
    read GEOCML_POSTGRES_PASSWORD
    export GEOCML_POSTGRES_PASSWORD=$GEOCML_POSTGRES_PASSWORD
    touch ~/.bashrc &> /dev/null
    if grep -q GEOCML_POSTGRES_PASSWORD ~/.bashrc; then
        echo "[INFO] Updating GEOCML_POSTGRES_PASSWORD in your bash profile."
        sed -i '' 's/GEOCML_POSTGRES_PASSWORD=.*/GEOCML_POSTGRES_PASSWORD='$GEOCML_POSTGRES_PASSWORD'/' ~/.bashrc
    else
        echo "[INFO] Adding this to your bash profile for future use."
        echo "GEOCML_POSTGRES_PASSWORD=$GEOCML_POSTGRES_PASSWORD" >> ~/.bashrc
    fi
fi

if [ "$GEOCML_INSTALLATION_METHOD" == "" ]
then
    echo "\nPlease select how you want to install geoCML to this machine."
    echo "1) Pull Docker image from GHCR (recommended)"
    echo "2) Build Docker image locally from source"
    read GEOCML_INSTALLATION_METHOD
fi

if [ "$GEOCML_INSTALLATION_METHOD" == "1" ]
then
    echo "Okay, geoCML will be installed by pulling the Docker image from GHCR."
elif [ "$GEOCML_INSTALLATION_METHOD" == "2" ]
then
    echo "Okay, geoCML will be installed by building the containers locally from source."
    echo "\n[INFO]: Building geoCML..."
    spinner &
    spinner_pid=$!

    mkdir /tmp/geocml/ &> /dev/null
    mkdir /tmp/geocml/logs &> /dev/null

    if [ "$DOCKER_COMPOSE_PATH" == "" ]
    then
        echo "\n[WARN]: It looks like this install script was run outside of the geoCML Base Deployment repository.."
        echo "\n[INFO]: Cloning into /tmp/geocml-base-deployment"
        git clone https://github.com/geoCML/geocml-base-deployment.git /tmp/geocml/geocml-base-deployment/ &> /tmp/geocml/logs/build.log
        cd /tmp/geocml/geocml-base-deployment/ &> /tmp/geocml/logs/build.log
        git fetch --tags --all &> /tmp/geocml/logs/build.log
        git checkout tags/$VERSION &> /tmp/geocml/logs/build.log
        DOCKER_COMPOSE_PATH=/tmp/geocml/geocml-base-deployment/
    fi

    mkdir ~/$GEOCML_DEPLOYMENT_NAME &> /tmp/geocml/logs/build.log
    cp -r $DOCKER_COMPOSE_PATH/* ~/$GEOCML_DEPLOYMENT_NAME &> /tmp/geocml/logs/build.log
    cd ~/$GEOCML_DEPLOYMENT_NAME/ &> /tmp/geocml/logs/build.log
    docker compose build --build-arg GEOCML_POSTGRES_PASSWORD --build-arg GEOCML_POSTGRES_ADMIN_PASSWORD --build-arg DRGON_HOST &> /tmp/geocml/logs/build.log
    echo "\n[INFO]: Finished building."
    echo "[INFO]: Check /tmp/logs/geocml/build.log for additional information about your build!"
else
    echo "No idea what $GEOCML_INSTALLATION_METHOD means! Please provide a valid installation method (1, 2). Exiting."
    exit 1
fi

rm -rf /tmp/geocml/geocml-base-deployment/ &> /tmp/geocml/logs/build.log

echo "[INFO] Starting geoCML..."

if [ "$DOCKER_COMPOSE_PATH" == "" ]
then
    cd /tmp/geocml
    docker compose up -d
fi

docker network create geocml-network &> /tmp/geocml/logs/start.log
docker compose down &> /tmp/geocml/logs/start.log
docker compose up -d &> /tmp/geocml/logs/start.log
kill $spinner_pid
wait $spinner_pid 2>/dev/null
echo "\n[INFO]: Finished startup."
echo "[INFO]: Check /tmp/logs/geocml/start.log for additional information about your deployment!"
exit 0
