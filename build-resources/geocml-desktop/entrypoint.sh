#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p qgis-ltr dbus
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

pip3 install qgis-plugin-manager --user
export PATH=/home/user/.local/bin:$PATH
mkdir -p ~/.local/share/QGIS/QGIS3/profiles/default/python/plugins
cd ~/.local/share/QGIS/QGIS3/profiles/default/python/plugins
qgis-plugin-manager init
qgis-plugin-manager update
qgis-plugin-manager install "QRestart"

cd ~
mkdir ~/.fonts
find /Persistence/Fonts/ -name '*.ttf' -exec cp {} ~/.fonts \; &
fc-cache -f -v &

xpra start :100 --start="qgis /Persistence/geocml-project.qgz" --bind-tcp=0.0.0.0:10000 --tcp-auth=env --no-daemon --no-notifications --no-mdns --no-pulseaudio

