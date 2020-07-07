


## **How to install:**

**Install requirements:**

- install Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- install Node.js v8.4 or higher: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- reboot



## **How to run:**

- npm start
- open in browser: [http://localhost:1313](http://localhost:1313)

## **How to test:**

- `npm run test` (to run whole test files)
- `npm run test ./src/nodes/nodes/schedule/schedule-checker.test.ts` (to run a particular test file)

## **Environmental variables customization**

- `cp .env.example .env`
- Edit .env file's variable as we want

## **How to run for develop (watch mode):**

- npm run watch

## **Run on x86 bit of machine (BBB, RaspberryPi)**

#### Prerequisites

- `node:10.x.x` (`serialport` is build on `node:10.x.x`, we can re `npm install serialport` if you don't have `node:10.x.x`)
- `npm`

#### Summary

- Currently we have RaspberryPi machine with `pi` user &
- BBB machine with `debian` user

We need the user for running commands.



#### Upload download snapshot

- Upload `.zip` file (`./snapshot/rubix-wires-${project.version}.zip`) to https://github.com/NubeIO/wires-builds (Just a convention)
- Download that `.zip` file into your x86 bit of machine and extract project where user have permission to `R/W/E`
- Make sure you have directory with writable permission `/data` (`sudo mkdir /data && sudo chown -R pi:pi /data` for db store, `pi` is the user)
- `npm run start:prod`
- Other scripts:
  - `npm run stop:prod`
  - `npm run delete:prod`
  - `npm run status:prod`
- Change Environmental variables:
  - We can have our own custom environment by editing `.env` file as in above
  - `PORT=1415 DATA_DIR=./db SECRET_KEY=**SECRET_KEY** npm run start:prod` (we can also pass run time environment, not recommended)

#### Enabling automatically restart service on reboot with Linux Service

- Make sure you have already started this App with `npm run start:prod`
- Steps:
  - `npm run save:prod` (It will save the info of the project for the `PM2`)
  - `sudo npm run startup:prod -- -u pi --hp /home/pi` (here `pi` is the user, and make sure you hit `sudo` at prefix)
  - `sudo systemctl enable pm2-pi.service` (`pm2-pi.service` is Linux Service created for user `pi`)
  - `sudo npm run unstartup:prod -- -u pi` (remove that Linux Service created from above command)
- Linux Service gets enable when we do above steps, but it runs through `Linux Service` after the system got restarted.
  So after the restart `npm run stop:prod` like commands won't work and we should use `systemctl` commands as below:
  - `sudo systemctl start pm2-pi.service`
  - `sudo systemctl stop pm2-pi.service`
  - `sudo systemctl restart pm2-pi.service`

#### How to update with new change?

##### Prerequisites:

- Make sure you haven't changed existing Node's name otherwise we need to migrate the `DB`.
- Started with the Linux Service

##### Steps:

- `rm -r rubix-wires-${version}`
- Download `.zip` file from server on the same location and extract
- `sudo systemctl restart pm2-pi.service`

## **Issues:**

If you get "Can't find Python executable C:\Python36\python.exe, you can set the PYTHON env variable." error when installing, try this:

- npm install --global --production windows-build-tools

#### Viewing Wires Logs

To monitor the logs of a program running via Linux Service. Use following commands:

- `For monitoring logs: journalctl -f -u <service-name>`
- `Displaying logs from starting on one page with scroll: journalctl -u <service-name>`
- `Displaying all logs: journalctl -u <service-name> --no-pager`
- `Displaying logs of last page: journalctl -u <service-name> --pager-end`
