# Bastion - Proof of Concept Multi UNIX Host Deployment Web Console

[![Alt text](https://img.youtube.com/vi/kEK51jJxE8A/maxresdefault.jpg)](https://www.youtube.com/embed/kEK51jJxE8A?rel=0;autohide=1;showinfo=0;color=white;cc_load_policy=1)
*(click image above for video demo)*

Multi UNIX host script deployment web console written in Javascript. Bastion uses the Node.js runtime environment, Express framework for the backend, Angular framework for the front end, and ssh-key authentication over OpenSSH for code deployment.

Bastion is built to cut down deploy time and data retrieval across 100+ host infrastructures. Scripts of any language is useable in conjunction with Bastion as long as the end hosts have the necessary interpreter installed. Currently only supports UNIX based distributions.

## Requirements
### Deployment Console Server
- UNIX system with private SSH key to connect to end hosts
- [node.js](https://nodejs.org/en/)
- list of cluster and hosts in './bastion/server/config/hosts.json'
- Private key and signed certificate for HTTPS https://nodejs.org/api/tls.html#tls_tls_ssl_concepts

### End hosts
- Admin account with public SSH key installed
- SSH password authentication disabled
- Admin account added to /etc/sudoers with NOPASSWD enabled

## Installation
1. Install [node.js](https://nodejs.org/en/)
2. Change to same directory housing 'package.json'
3. Install dependencies
```
npm install
```
4. Place private key and certificate in same directory.  Follow naming convention of '{keyname}-key.pem' and '{certname}-cert.pem'.

## Usage
1. Change to same directory housing 'server.js'
2. Grant executable permissions to 'server.js'
```
chmod +x server.js
```
3. Start the app
```
./server.js
```
3. Visit 'https://{server ip}:8000/'
