# Proof of Concept Multi UNIX host script deployment Web Console

## Requirements
Deployment Console Server -
- UNIX system with private SSH key to connect to end hosts
- Node interpreter installed
- list of cluster and hosts in './bastion/server/config/hosts.json'
- Private key and signed certificate for HTTPS https://nodejs.org/api/tls.html#tls_tls_ssl_concepts

End hosts -
- Admin account with public SSH key installed
- SSH password authentication disabled
- Admin account added to /etc/sudoers with NOPASSWD enabled

## Installation
1. Install node.js https://nodejs.org/en/
2. Change to same directory housing 'package.json'
3. Issue 'npm install'
4. Place private key and certificate in same directory.  Follow naming convention of '{keyname}-key.pem' and '{certname}-cert.pem'.

Usage:
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
