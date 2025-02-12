#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p postgresql
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

python3.11 -m pip install -r /geocml-task-scheduler/geocml-task-scheduler/requirements.txt

python3.11 /geocml-task-scheduler/geocml-task-scheduler/schedule.py &
tail -f task_log
