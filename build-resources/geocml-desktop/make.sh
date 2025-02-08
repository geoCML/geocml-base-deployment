#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p wget gnupg xvfb-run ansible
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

wget -q https://xpra.org/gpg.asc -O- | apt-key add -
apt update
apt install -y xpra --no-install-recommends --no-install-suggests

ansible-galaxy collection install ansible.posix && ansible-galaxy install -r geocml-desktop-requirements.yaml && ansible-playbook -i,localhost geocml-desktop-playbook.yaml --tags "all" && rm -f ./*.yaml

