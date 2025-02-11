#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p nodejs_22
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

cd /portal/ && npm i
echo REACT_APP_DRGON_HOST=$DRGON_HOST >> /portal/.env

npm run build

cp -rf /portal/build/* /var/www/html/
rm -rf /portal/

ln -s /Persistence/geocml-project.qgz /usr/lib/cgi-bin/geocml-project.qgz
service apache2 start
tail -f /dev/null
