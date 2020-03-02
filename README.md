# wires-builds


## On dev PC

update the npm build version 
https://docs.npmjs.com/updating-your-published-package-version-number

```
npm version patch
```

```
sudo npm run build --prod --target=edge28
```

find the build file in *snapshot`

```
snapshot/reactive-wires-${version}.zip
```

```
git push https://github.com/NubeIO/wires-builds.git 
unzip 0.0.0
```



## On the host

### clone and unzip the repo and other

```
wget https://github.com/NubeIO/wires-builds/archive/0.0.0.zip
unzip 0.0.0.zip //your build version
cd wires-builds-0.0.0
unzip reactive-wires-0.0.0.zip
cd reactive-wires-0.0.0
sudo mkdir /data && sudo chown -R pi:pi /data
```


### Installed nodejs

```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs
```

### run wires

```
npm run start:prod
```


