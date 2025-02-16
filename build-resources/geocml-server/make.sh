#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p ansible
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

ansible-galaxy collection install ansible.posix && ansible-galaxy install -r geocml-server-requirements.yaml && ansible-playbook -i,localhost geocml-server-playbook.yaml --tags "all" && rm -f ./*.yaml
