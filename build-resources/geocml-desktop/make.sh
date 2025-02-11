#!/usr/bin/env nix-shell
#! nix-shell -i bash
#! nix-shell -p wget gnupg git
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz

git clone https://github.com/Xpra-org/xpra /tmp/xpra
cd /tmp/xpra
./setup.py install-repo
cd /
rm -rf /tmp/xpra
apt install -y xpra

mkdir -p /run/user/0/xpra
sed -ie 's/^start-child/#start-child/' /etc/xpra/xpra.conf
