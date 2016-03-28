# tcbr
Bits and pieces used for the Townsville to Cairns Bike Ride

## scraper.js ##

Scrapes content from the Children's Cancer Institute donations site. Currently scrapes the TCBR donation total from https://donate.ccia.org.au/campaign/1/townsville-to-cairns-bike-ride-2016

`node scrape.js` to run. Needs to be run on a schedule. 

## server.js ##

Serves up the result of scraper.js. The contents are served up from a file which is configurable in config.js.

`node server.js` to run. Port is configurable in config.js and is set to 80 for prod. 

## server config ##

Basic Amazon Linux AMI. Uses the `tcbr-sydney-2016.pem` file for SSH. To set it up, run the following:

### General setup and config ###

- General update: `sudo yum update`
- Install git: `sudo yum install git`
- Install NVM: `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash` (or follow https://github.com/creationix/nvm)
- Install a stable version of node: `nvm install stable`
- Install PM2: `npm install pm2 -g`
- Git clone the tcbr repo: `git clone https://github.com/dancet/tcbr.git`
- NPM install: `cd tcbr && npm i`
- Create the config file:
  - For local dev: `var config = module.exports = require('./config_defaults');` in the `config.js` file
  - For prod: `ln -s config_prod.js config.js` to create a symlink

### Run the scraper and server ###

- Start a screen session: `screen` (`-r` if one is already running)
- Add the scraper.js to crontab: `crontab -e` then add something like `*/5 * * * * /home/ec2-user/.nvm/versions/node/v5.9.1/bin/node /home/ec2-user/tcbr/scraper.js` (use `which node` to find the node executable)
  - Check the cron task is working as expected (should execute every 5 mins)
- In a new screen tab, start the server: `pm2 start server.js`
- Tail the logs: `pm2 logs server`
- Ensure the security group applied to the EC2 instance allows inbound traffic via the specified port

### Check all is working as expected ###

- An A record has been added to the TCBR server for `current-donations.tcbr.org.au` -> `54.206.41.31`
- The URL to hit is `/fundraising_total` on port 8080 (by default), so `curl http://current-donations.tcbr.org.au:8080/fundraising_total` should return some data
