const cp = require('child_process');
const ipAddress = '192.168.0.178';
const subnetMask = '255.255.255.0';
const gateway = '192.168.0.1';
const iface = cp
    .execSync('connmanctl services')
    .toString()
    .replace(/\s/g, '')
    .substring(8);
const setIP = `sudo connmanctl config ${iface} --ipv4 manual ${ipAddress} ${subnetMask} ${gateway} --nameservers 8.8.8.8 8.8.4.4`;
cp.execSync(setIP);
const setIpDHCP = `sudo connmanctl config ${iface} --ipv4 dhcp`;
cp.execSync(setIpDHCP);
//# sourceMappingURL=connmanctl-tests.js.map