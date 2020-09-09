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


## **Environmental variables customization**

- `cp .env.example ${dataDir}/.env` (by default: `dataDir = /data/rubix-wires/` is for production and `dataDir = ~/db/`
  is for local)
- Edit `.env` file's variable as we want

_<b>Note:</b> If `.env` exist on both location, project directory `.env` gets first priority and then data directory
`.env`_

### Update Environmental variable

- update `.env` file
- `npm run updateEnv:prod`
- `systemctl restart nubeio-rubix-wires` OR `reboot`

OR

- update `.env` file
- `bash script.bash start -u=pi -hp=/home/pi` (more details on below)

## **How to run for develop (watch mode):**

- npm run watch

## **Run on x86 bit of machine (BBB, RaspberryPi)**

#### Prerequisites

- `node:10.x.x` (`serialport` is build on `node:10.x.x`, we can re `npm install serialport` if you don't have `node:10.x.x`)
- `npm`

#### Note

- Currently we have RaspberryPi machine with `pi` user, `home/pi` home_path &
- BBB machine with `debian` user, `home/debian` path

We need the user for running commands.

#### Create snapshot

- `npm install`
- `npm run build --prod --target=x86` (Create production `.zip` file for the deployment)

#### Transfer snapshot

- Transfer `.zip` file to edge device

#### Scripts for `start | disable | enable | remove`

- `bash script.bash start -u=pi -hp=/home/pi` (optional parameters: `-l`, `-ug`, `-ilr`)
- `bash script.bash start -u=pi -hp=/home/pi -l=false` --for logging false
- `bash script.bash disable`
- `bash script.bash enable`
- `bash script.bash remove -u=pi`
- `bash script.bash -h`

Here, `pi` is user and `/home/pi` is home_path for PM2 file creation.

#### Individual run script

- `npm run start:prod`
- `npm run stop:prod`
- `npm run delete:prod`
- `npm run status:prod`
- `npm run save:prod` (It will save the info of the project for the `PM2`)
- `sudo npm run startup:prod -- -u pi --hp /home/pi --service-name nubeio-rubix-wires` (create Linux Service file, here `pi` is the user, and make sure you hit `sudo` at prefix)
- `sudo systemctl enable nubeio-rubix-wires.service`
- `sudo npm run unstartup:prod -- -u pi --service-name nubeio-rubix-wires` (remove that Linux Service created from above command)

#### Change Environmental variables:

- We can have our own custom environment by editing `.env` file as in above
- `PORT=1415 DATA_DIR=./db SECRET_KEY=**SECRET_KEY** npm run start:prod` (we can also pass run time environment, not recommended)

#### Linux service

- `sudo systemctl start nubeio-rubix-wires.service`
- `sudo systemctl stop nubeio-rubix-wires.service`
- `sudo systemctl restart nubeio-rubix-wires.service`



### Viewing Wires Logs

To monitor the logs of a program running via Linux Service. Use following commands:

```
cd rubix-wires/node_modules/pm2/bin
./pm2 logs 0  #for last 15 lines
./pm2 logs 0 --lines 1000 #for last 1000 lines
./pm2 logs 0 --err #only error
./pm2 logs 0 --out #only shows standard output
./pm2 logs 0 --highlight mqtt #grep mqtt log
```

### The actual log file location

`<home_location>/.pm2`

```
debian@beaglebone:~/.pm2/logs$ ls -la -h
total 8.1M
drwxr-xr-x 2 debian debian 4.0K Jul  3 15:41 .
drwxr-xr-x 5 debian debian 4.0K Jul 14 18:26 ..
-rw-r--r-- 1 debian debian  26K Jul 20 18:18 app-error.log
-rw-r--r-- 1 debian debian 8.1M Jul 30 09:56 app-out.log
debian@beaglebone:~/.pm2/logs$

```

- `For monitoring logs: journalctl -f -u <service-name>`
- `Displaying logs from starting on one page with scroll: journalctl -u <service-name>`
- `Displaying all logs: journalctl -u <service-name> --no-pager`
- `Displaying logs of last page: journalctl -u <service-name> --pager-end`

### Disable logging

```
npm run start:prod -o "/dev/null" -e "/dev/null"
```


