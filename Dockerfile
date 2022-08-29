FROM ghcr.io/j-simmons-phd/kasm-core-ubuntu-focal:develop
USER root

ENV HOME /home/kasm-default-profile
ENV STARTUPDIR /dockerstartup
ENV INST_SCRIPTS $STARTUPDIR/install
WORKDIR $HOME

######### Customize Container Here ###########

# copy over install_files/ for use in playbooks
ADD install_files $HOME/install_files
RUN apt update && apt install -y sudo

# fix for .gnupg/ permissions when building custom images
RUN apt install -y qgis

# Install PostgreSQL, PostGIS, and PG Admin
RUN apt install -y postgresql && apt install -y postgis 
RUN curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | apt-key add && sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
RUN apt install -y pgadmin4-desktop

# Install Python packages with pip
RUN apt install -y python3-pip && pip install pint

# install Ansible per 
# https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-ubuntu
RUN add-apt-repository --yes --update ppa:ansible/ansible && apt install -y ansible

# run Ansible commands
COPY ./requirements.yaml ./playbook.yaml ./
RUN ansible-galaxy install -r requirements.yaml && ansible-playbook -i,localhost playbook.yaml --tags "all" && rm -f ./*.yaml
# Custom Desktop Background - replace bg_custom.png on disk with your own background image

# Uninstall Ansible stuff
RUN rm -rf $HOME/.ansible && apt purge -y ansible*

COPY ./bg_custom.png /usr/share/extra/backgrounds/bg_default.png

# Create .profile and set XFCE terminal to use it
RUN cp /etc/skel/.profile $HOME/.profile && mkdir $HOME/.config/xfce4/terminal/
COPY ./terminalrc /home/kasm-default-profile/.config/xfce4/terminal/terminalrc

COPY devResources/su /etc/pam.d/su

# clean up install_files/
RUN rm -rf $HOME/install_files/

######### End Customizations ###########

# Remove install cache
RUN apt clean autoclean && apt autoremove -y && rm -rf /var/lib/{apt,dpkg,cache,log}/

RUN chown 1000:0 $HOME
RUN $STARTUPDIR/set_user_permission.sh $HOME

ENV HOME /home/kasm-user
WORKDIR $HOME
USER default
