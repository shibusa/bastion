Proof of Concept BASH script deployment Web Console

Requirements:
Deployment Console Server -
- Account with private SSH key to connect to end hosts
- Node/Angular/Express installed
- list of cluster and hosts in proper './server/config/hosts.json' format

End hosts -
- Admin account with public SSH key installed
- SSH password authentication disabled
- Admin account added to /etc/sudoers with NOPASSWD enabled

Installation:
1. Install node.js https://nodejs.org/en/
2. Change to same directory housing 'package.json'
3. Issue 'npm install'

Usage:
1. Change to same directory housing 'server.js'
2. Issue 'node server.js'
3. Visit 'http://{server ip}:8000/'
