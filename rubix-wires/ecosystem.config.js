const minimist = require('minimist');
// with pm2 command, argv_index=4
const argv     = minimist([minimist(process.argv.slice(4))['node-args'] || '']);
const datadir  = argv['datadir'] || '/data/rubix-wires/';
const envFile  = argv['envFile'] || '/data/rubix-wires/.env';

module.exports = {
  apps: [{
    cwd               : __dirname,
    name              : 'rubix-wires',
    script            : 'app.js',
    args              : `--datadir ${datadir} --envFile ${envFile}`,
    instances         : 1, // number process of application. must be `1`
    exec_mode         : 'fork_mode', // must be fork_mode due to pub/sub like `transmitter` cannot work in cluster mode
    autorestart       : true, //auto restart if app crashes
    max_memory_restart: '300M',
    env               : { NODE_ENV: 'production' },
    watch             : false,
  }],
};
