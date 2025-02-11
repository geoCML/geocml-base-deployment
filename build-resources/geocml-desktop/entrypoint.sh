#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p qgis-ltr dbus
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

xpra start :100 --start="qgis /Persistence/geocml-project.qgz" --bind-tcp=0.0.0.0:10000 --tcp-auth=env --no-daemon --no-notifications --no-mdns --no-pulseaudio

