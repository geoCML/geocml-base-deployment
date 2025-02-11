#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p unzip wget
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

TABOR_VERSION=0.3.0

touch /task_log
wget "https://github.com/geoCML/tabor/releases/download/v$TABOR_VERSION/tabor-$TABOR_VERSION-ubuntu-latest.zip" -P /geocml-task-scheduler/
cd /geocml-task-scheduler/
unzip "/geocml-task-scheduler/tabor-$TABOR_VERSION-ubuntu-latest.zip"
cd /
rm "/geocml-task-scheduler/tabor-$TABOR_VERSION-ubuntu-latest.zip"
