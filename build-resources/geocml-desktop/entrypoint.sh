#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p qgis
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

#CMD ["xpra", "start", ":100", "--start-child=/usr/bin/qgis /Persistence/geocml-project.qgz", "--bind-tcp=0.0.0.0:10000", "--tcp-auth=env", "--no-daemon", "--no-notifications", "--no-mdns", "--no-pulseaudio", "--exit-with-children"]
xpra start :100 --start-child="qgis /Persistence/geocml-project.qgz" --bind-tcp=0.0.0.0:10000 --tcp-auth=env --no-daemon --no-notifications --no-mdns --no-pulseaudio

