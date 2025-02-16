#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p ansible
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

ansible-galaxy collection install ansible.posix && ansible-galaxy install -r geocml-postgres-requirements.yaml --force && ansible-playbook -i,localhost geocml-postgres-playbook.yaml --tags "all" -e "ansible_python_interpreter=$(which python3.10)" && rm -f ./*.yaml

service postgresql start
tail -f /dev/null
