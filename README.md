## **How to install:**

**Install requirements:**

- install Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- install Node.js v8.4 or higher: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- reboot

## **How to run:**

- `npm start`
- open in browser: [http://localhost:1313](http://localhost:1313)

## **Environmental variables customization**

- `cp .env.example ${dataDir}/.env` (by default: `dataDir = /data/rubix-wires/` is for production and `dataDir = ~/db/`
  is for local)
- Edit `.env` file's variable as we want

_<b>Note:</b> If `.env` exist on both location, project directory `.env` gets first priority and then data directory
`.env`_

## **Run on x86 bit of machine (BBB, RaspberryPi)**

#### Prerequisites

- `node:10.x.x` (`serialport` is build on `node:10.x.x`, we can re `npm install serialport` if you don't have `node:10.x.x`)
- `npm`

#### Summary

- Currently we have RaspberryPi machine with `pi` user, `home/pi` home_path &
- BBB machine with `debian` user, `home/debian` path

We need the user for running commands.

#### Create snapshot

- `npm install`
- `npm run build --prod --target=x86` (Create production `.zip` file for the deployment)

#### Transfer snapshot

- Transfer `.zip` file to edge device

#### Scripts for `start | disable | enable | remove`

- `bash script.bash start -u=pi -hp=/home/pi` (optional parameters: -l, -ug)
- `bash script.bash start -u=pi -hp=/home/pi -l=false` --logging false
- `bash script.bash disable -u=pi`
- `bash script.bash enable -u=pi`
- `bash script.bash remove -u=pi`
- `bash script.bash -h` (for help)

Here, `pi` is user and `/home/pi` is home_path for PM2 file creation.

#### Individual run script

- `npm run start:prod`
- `npm run stop:prod`
- `npm run delete:prod`
- `npm run status:prod`
- `npm run save:prod` (It will save the info of the project for the `PM2`)
- `sudo npm run startup:prod -- -u pi --hp /home/pi` (create Linux Service file, here `pi` is the user, and make sure you hit `sudo` at prefix)
- `sudo systemctl enable pm2-pi.service` (`pm2-pi.service` is Linux Service created for user `pi`)
- `sudo npm run unstartup:prod -- -u pi` (remove that Linux Service created from above command)

#### Change Environmental variables

- We can have our own custom environment by editing `.env` file as in above
- `PORT=1415 DATA_DIR=./db SECRET_KEY=**SECRET_KEY** npm run start:prod` (we can also pass run time environment, not recommended)

#### Linux service

- `sudo systemctl start pm2-pi.service`
- `sudo systemctl stop pm2-pi.service`
- `sudo systemctl restart pm2-pi.service`

#### How to update with new change?

##### Prerequisites:

- Make sure you haven't changed existing Node's name otherwise we need to migrate the `DB`.
- Started with the Linux Service

##### Steps:

- `rm -r rubix-wires-${version}`
- Export all nodes and store somewhere and delete nodes from `DB`
 (`rm -r /data/rubix-wires/app.db /data/rubix-wires/dashboard.db /data/rubix-wires/history.db /data/rubix-wires/nodes.db /data/rubix-wires/schedule.db`)
- `sudo systemctl restart pm2-pi.service`
- Import all nodes

## **Issues:**

If you get "Can't find Python executable C:\Python36\python.exe, you can set the PYTHON env variable." error when installing, try this:

- npm install --global --production windows-build-tools

## Viewing Wires Logs

To monitor the logs of a program running via Linux Service. Use following commands:

cd rubix-wires/node_modules/pm2/bin
- `npm run pm2 logs` # for last 15 lines
- `npm run pm2 logs --lines 1000` # for last 1000 lines
- `npm run pm2 logs --err` # only error
- `npm run pm2 logs --out` # only shows standard output
- `npm run pm2 logs --highlight mqtt` # grep mqtt log
- `npm run pm2 logs 0` # for app 0, last 15 lines
