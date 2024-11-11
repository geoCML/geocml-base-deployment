echo "Starting up geoCML... this should only take a moment."
sh .env

command -v docker | export DOCKER_INSTALLED=$?

if [[ $DOCKER_INSTALLED -ne 0 ]]; then
	echo "Error: Docker is not installed on this machine."
	exit 1
fi

docker compose up -d

echo "Done! You can stop your geoCML instance at any time with 'docker compose down'."
exit 0

