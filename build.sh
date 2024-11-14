echo "Starting up geoCML... this should only take a few minutes."
sh .env

command -v docker | export DOCKER_INSTALLED=$?

if [[ $DOCKER_INSTALLED -ne 0 ]]; then
	echo "Error: Docker is not installed on this machine."
	exit 1
fi

docker compose build --build-arg GEOCML_POSTGRES_PASSWORD --build-arg GEOCML_POSTGRES_ADMIN_PASSWORD --build-arg DRGON_HOST

echo "Done! You can start your geoCML instance by running the 'start.sh' script."
exit 0

