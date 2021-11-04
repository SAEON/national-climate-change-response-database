<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Configure CentOS 7.6](#configure-centos-76)
  - [Configure login to work without a password (optional)](#configure-login-to-work-without-a-password-optional)
  - [Give your user passwordless sudo access (optional)](#give-your-user-passwordless-sudo-access-optional)
  - [Install Docker](#install-docker)
  - [Install Docker Compose](#install-docker-compose)
    - [Clean up docker files regularly](#clean-up-docker-files-regularly)
    - [Add your user to the 'docker' group](#add-your-user-to-the-docker-group)
  - [Install Nginx](#install-nginx)
    - [Configure Nginx TSL](#configure-nginx-tsl)
    - [Configure Nginx server blocks](#configure-nginx-server-blocks)
  - [Install and configure firewalld](#install-and-configure-firewalld)
  - [Setup continuous deployment via GitHub Actions](#setup-continuous-deployment-via-github-actions)
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

### Configure Nginx TSL

```sh
ssh <user>@<hostname>
sudo su
mkdir /opt # Might already exist
mkdir /opt/ssl

# Generate dhparams
openssl dhparam -out /opt/ssl/dhparam.pem 2048
```

Obtain SSL certs - the following two files are expected to exist:

```txt
/opt/ssl/nccrd.saeon.ac.za.cer
/opt/ssl/nccrd.saeon.ac.za.key
```

### Configure Nginx server blocks

Reference nginx files are defined in `src/nginx`. Overwrite the target nginx configuration with these files (obviously adjusting for the specific deployment environment)

```txt
src/nginx/nginx.conf => /etc/nginx/nginx.conf (overwrite the main configuration file)
src/nginx/conf.d/ => /etc/nginx/conf.d/ (overwrite the conf.d configuration directory)
```

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

On the deployment server, create a limited permissions user called `runner`

```sh
sudo su
adduser runner
passwd runner # Enter a strong password, and add this password as a repository secret
```

The `runner` user needs to be able to run `docker`, but should not be in the `docker` group

```sh
visudo

# Add this line to the bottom of the visudo file
runner ALL=NOPASSWD: /opt/deploy-docker-stack.sh
```

Create the deploy script `/opt/deploy-docker-stack.sh` with the following content

```sh
#!/bin/sh

echo "Compose file: $1"
echo "Compose env file $2"
echo "Deploying stack: $3"

export $(cat $2) > /dev/null 2>&1;
docker stack deploy -c $1 $3
```

Make sure the script has the correct permissions

```sh
chown root /opt/deploy-docker-stack.sh
chmod 755 /opt/deploy-docker-stack.sh
```

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
