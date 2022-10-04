# Configure CentOS 7.6

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [(Optional) Configure SSH login](#optional-configure-ssh-login)
- [(Optional) Give your user passwordless sudo access](#optional-give-your-user-passwordless-sudo-access)
- [Install Docker](#install-docker)
- [Install Nginx](#install-nginx)
  - [Configure SSL](#configure-ssl)
  - [Configure Nginx](#configure-nginx)
- [Install and configure firewalld](#install-and-configure-firewalld)
- [Setup continuous deployment via GitHub Actions](#setup-continuous-deployment-via-github-actions)
- [Disable SELinux (or configure it correctly)](#disable-selinux-or-configure-it-correctly)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# (Optional) Configure SSH login

```sh
# Create an RSA key on YOUR computer
# Use defaults for all options
ssh-keygen -t rsa

# Copy your public key
cat ~/.ssh/id_id_rsa.pub # Copy the output to your clipboard
```

```sh
# Login
ssh <user>@<hostname>

# If you logged in as root, setup a new user
adduser <name>
su <name> # Login as the user you have just created

# Add the encryption key you previously generated to this machine
mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
vi ~/.ssh/authorized_keys # Copy your id_rsa.pub key into this file

# Configure public key authentication
sudo su
vi /etc/ssh/sshd_config
# set PubkeyAuthentication to 'yes'

# Arguably a server is more secure if you disable password login and don't allow root login
# set PermitRootLogin to 'no'
# set PasswordAuthentication to 'no'

# Restart the SSH service
service sshd restart
```

# (Optional) Give your user passwordless sudo access

```sh
visudo

# Add this line to the bottom of the visudo file
<name> ALL=(ALL) NOPASSWD:ALL
```

# Install Docker

```sh
ssh <user>@<hostname>

sudo yum install -y yum-utils

sudo yum-config-manager \
  --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker
```

Add a docker-cleanup job to the CRONTAB

```sh
sudo su
crontab -e

# Add this line
0 0 * * 0 docker system prune -f > /opt/docker-system-clean.log 2>&1
```

# Install Nginx

```sh
ssh <user>@<hostname>
sudo yum -y install nginx
systemctl enable nginx
systemctl start nginx
```
## Configure SSL
```sh
ssh <user>@<hostname>
sudo su
mkdir /opt # Might already exist
mkdir /opt/ssl

# Generate dhparams
openssl dhparam -out /opt/ssl/dhparam.pem 2048
```

Obtain SSL certs. Or create self-signed certs for testing:

```sh
sudo openssl req -x509 -nodes -days 999 -newkey rsa:2048 -keyout /opt/ssl/<hostname>.key -out  /opt/ssl/<hostname>.cer
```

## Configure Nginx
Reference nginx files are defined in the `platform/centos/nginx` folder. The server blocks should be updated for the correct hostname, and for SSL cert paths

# Install and configure firewalld

```sh
ssh <user>@<hostname>
sudo yum -y install firewalld
sudo systemctl unmask firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --permanent --add-port=1433/tcp # SQL Server
sudo firewall-cmd --reload
```

# Setup continuous deployment via GitHub Actions

On the deployment server, create a limited permissions user called `runner` that is part of the `docker` group

```sh
sudo adduser runner
sudo usermod -aG docker runner
```


# Disable SELinux (or configure it correctly)

```sh
ssh <user>@<hostname>
sudo vi /etc/selinux/config

# Make sure this line is uncommented
SELINUX=disabled

# Reboot the server
reboot
```
