<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

- [Configure CentOS 7.6](#configure-centos-76)
  - [Configure login to work without a password (optional)](#configure-login-to-work-without-a-password-optional)
  - [Give your user passwordless sudo access (optional)](#give-your-user-passwordless-sudo-access-optional)
  - [Install Docker](#install-docker)
  - [Install Docker Compose](#install-docker-compose)
    - [Clean up docker files regularly](#clean-up-docker-files-regularly)
    - [Add your user to the 'docker' group](#add-your-user-to-the-docker-group)
  - [Install Nginx](#install-nginx)
    - [Configure Nginx](#configure-nginx)
    - [Copy Nginx configuration files](#copy-nginx-configuration-files)
  - [Install and configure firewalld](#install-and-configure-firewalld)
  - [Setup continuous deployment via GitHub Actions](#setup-continuous-deployment-via-github-actions)
    - [Install GitHub actions runner](#install-github-actions-runner)
    - [Configure GitHub to use this runner](#configure-github-to-use-this-runner)
  - [Disable SELinux (or configure it correctly)](#disable-selinux-or-configure-it-correctly)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Configure CentOS 7.6
Configuring CentOS involves running some commands and editing some text files using the `vi` (or some other text editor that comes with, or is installed, on CentOS).

## Configure login to work without a password (optional)
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

## Give your user passwordless sudo access (optional)
```sh
visudo

# Add this line to the bottom of the visudo file
<name> ALL=(ALL) NOPASSWD:ALL
```

## Install Docker
```sh
ssh <user>@<hostname>
sudo su
yum -y remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
yum -y remove docker-ce docker-ce-cli containerd.io
yum -y install yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum -y install docker-ce docker-ce-cli containerd.io
systemctl enable docker
systemctl start docker
```

## Install Docker Compose
```sh
ssh <user>@<hostname>
sudo su
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Clean up docker files regularly
```sh
ssh <user>@<hostname>
sudo su
crontab -e
```

Make sure the following line is in the crontab

```sh
0 0 * * 0 docker system prune -f > /opt/docker-system-clean.log 2>&1
```

### Add your user to the 'docker' group
```sh
ssh <user>@<hostname>
sudo su
usermod -a -G docker <name>
```

## Install Nginx
```sh
ssh <user>@<hostname>
sudo su
yum -y install epel-release
yum -y install nginx
systemctl enable nginx
systemctl start nginx
```

### Configure Nginx
```sh
ssh <user>@<hostname>
sudo su
mkdir /opt # Might already exist
mkdir /opt/ssl

# Generate dhparams
openssl dhparam -out /opt/ssl/dhparam.pem 512
```

Obtain SSL certs - the following two files are expected to exist:

```txt
/opt/ssl/nccrd.saeon.ac.za.cer
/opt/ssl/nccrd.saeon.ac.za.key
```

### Copy Nginx configuration files
Manually copy two files from this repository onto the server

```txt
platform/centos/nginx/nginx.conf => /etc/nginx/nginx.conf (overwrite the existing file)
platform/centos/nginx/nccrd.conf => /etc/nginx/conf.d/nccrd.conf (change <hostname> to the correct hostname)
```

*NOTE - **Did you replace <hostname> in nccrd.conf??***

## Install and configure firewalld
```sh
ssh <user>@<hostname>
sudo su
yum -y install firewalld
systemctl unmask firewalld
systemctl enable firewalld
systemctl start firewalld    
firewall-cmd --permanent --zone=public --add-service=http 
firewall-cmd --permanent --zone=public --add-service=https
firewall-cmd --permanent --add-port=1433/tcp # SQL Server 
firewall-cmd --reload
```

## Setup continuous deployment via GitHub Actions
This actually involves two things:

1. Installing & configuring a self-hosted GitHub actions runner on your server
2. Creating a workflow file in the source code repository to use the runner

### Install GitHub actions runner
```sh
# Create a passwordless 'runner' user
ssh <user>@<hostname>
sudo su
adduser runner
usermod -a -G docker runner

# Allow runner sudo access to a single script
visudo

# Make sure these lines exists towards the bottom of the file
runner ALL=NOPASSWD: /home/runner/svc.sh
runner ALL=NOPASSWD: /home/runner/bin/installdependencies.sh

# NOTE - after installing the runner, once CD is working, revoke this access!
```
### Configure GitHub to use this runner
Create a workflow file in the .github/workflows directory in this repository. Use the `stable.yml` file as a reference

## Disable SELinux (or configure it correctly)
```sh
ssh <user>@<hostname>
sudo su
vi /etc/selinux/config

# Make sure this line is uncommented
SELINUX=disabled

# Reboot the server
reboot
```
