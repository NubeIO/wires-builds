**Install requirements:**

- Git
- NodeJS 10.x.x (`serialport` is build on `node:10.x.x`, we can re `npm install serialport` if you don't have `node:10.x.x`)

## **How to install:**


### Scripts for full setup `start` | `disable` | `enable` | `delete`
**Main Install (RPi)**
- `bash script.bash start -u=pi -hp=/home/pi` (optional parameters: -l, -ug)
  
**Other**
- `bash script.bash start -u=pi -hp=/home/pi -l=false` --logging false
- `bash script.bash disable -u=pi`
- `bash script.bash enable -u=pi`
- `bash script.bash delete -u=pi`
- `bash script.bash -h` (for help)

Here, `pi` is user and `/home/pi` is home_path for PM2 file creation.

#### Individual scripts

- `npm run start:prod`
- `npm run stop:prod`
- `npm run delete:prod`
- `npm run status:prod`
- `npm run save:prod` (It will save the info of the project for the `PM2`)
- `sudo npm run startup:prod -- -u pi --hp /home/pi` (create Linux Service file, here `pi` is the user, and make sure you hit `sudo` at prefix)
- `sudo systemctl enable pm2-pi.service` (`pm2-pi.service` is Linux Service created for user `pi`)
- `sudo npm run unstartup:prod -- -u pi` (remove that Linux Service created from above command)

### System Service

- `sudo systemctl start pm2-pi.service`
- `sudo systemctl stop pm2-pi.service`
- `sudo systemctl restart pm2-pi.service`

## How to update with new change?


## **How to run (one off):**

- `npm start`
- open in browser: [http://localhost:1313](http://localhost:1313)

## **Environmental variables customization**

- `PORT=1415 DATA_DIR=./db SECRET_KEY=**SECRET_KEY** npm run start:prod` (we can also pass run time environment, not recommended)
  
or
- `cp .env.example ${dataDir}/.env` (by default: `dataDir = /data/rubix-wires/` is for production and `dataDir = ~/db/`
  is for local)
- Edit `.env` file's variable as we want

_<b>Note:</b> If `.env` exist on both location, project directory `.env` gets first priority and then data directory
`.env`_

## Viewing Wires Logs

To monitor the logs of a program running via Linux Service. Use following commands:

cd rubix-wires/node_modules/pm2/bin
- `npm run pm2 logs` # for last 15 lines
- `npm run pm2 logs --lines 1000` # for last 1000 lines
- `npm run pm2 logs --err` # only error
- `npm run pm2 logs --out` # only shows standard output
- `npm run pm2 logs --highlight mqtt` # grep mqtt log
- `npm run pm2 logs 0` # for app 0, last 15 lines

## **Issues:**

If you get "Can't find Python executable C:\Python36\python.exe, you can set the PYTHON env variable." error when installing, try this:

- npm install --global --production windows-build-tools
