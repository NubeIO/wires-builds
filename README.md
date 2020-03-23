# wires-builds

### Install Node.js

```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs
```

#### Download and Start snapshot

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
