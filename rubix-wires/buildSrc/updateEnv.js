const { ensureDirectoryExistence } = require('./fileUtils');

const dotenv = require('dotenv');
const shell = require('shelljs');
const pjson = require('../package.json');

ensureDirectoryExistence('src');
shell.cp('-Rf', 'app.config.ts', 'src/config.ts');

const replaceRubixInfo = () => {
  shell.sed('-i', /\$RUBIX_VERSION/g, process.env.RUBIX_VERSION || pjson.version, 'src/config.ts');
  const branchHash = shell.exec('git rev-parse --short HEAD').replace(/[\W]+/g, '');
  const branch = shell.exec("git branch | grep \\* | cut -d ' ' -f2").replace(/[\n]+/g, '');
  shell.sed('-i', /\$RUBIX_HASH/g, process.env.RUBIX_HASH || branchHash, 'src/config.ts');
  shell.sed('-i', /\$RUBIX_BRANCH/g, process.env.RUBIX_BRANCH || branch, 'src/config.ts');
  shell.sed('-i', /\$RUBIX_BUILD/g, process.env.RUBIX_BUILD || '', 'src/config.ts');
};

function replaceBSA() {
  shell.sed('-i', /\$BSA_BASEURL/g, process.env.BSA_BASEURL || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_USERNAME/g, process.env.BSA_USERNAME || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_PASSWORD/g, process.env.BSA_PASSWORD || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_PATHS_MEASUREMENT_PATH/g, process.env.BSA_PATHS_MEASUREMENT_PATH || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_PATHS_MEASUREMENT_ACCEPT/g, process.env.BSA_PATHS_MEASUREMENT_ACCEPT || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_PATHS_ALARM_PATH/g, process.env.BSA_PATHS_ALARM_PATH || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_PATHS_ALARM_ACCEPT/g, process.env.BSA_PATHS_ALARM_ACCEPT || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_PATHS_ALARM_CONTENTTYPE/g, process.env.BSA_PATHS_ALARM_CONTENTTYPE || '', 'src/config.ts');
  shell.sed('-i', /\$BSA_PATHS_DEVICE_PATH/g, process.env.BSA_PATHS_DEVICE_PATH || '', 'src/config.ts');
}

function replaceBackend() {
  let backendEnabled = /true|1/i.test(process.env.BACKEND_ENABLED || 'false');
  shell.sed('-i', /'\$BACKEND_ENABLED'/g, backendEnabled.toString(), 'src/config.ts');
  shell.sed('-i', /\$BACKEND_API/g, process.env.BACKEND_API || 'http://localhost:8080/api/', 'src/config.ts');
  shell.sed('-i', /'\$NODE_DISTANCE'/g, process.env.NODE_DISTANCE || 60, 'src/config.ts');
  shell.sed('-i', /'\$NODE_REFRESH_INTERVAL_SEC'/g, process.env.NODE_REFRESH_INTERVAL_SEC || 60, 'src/config.ts');
  shell.sed('-i', /'\$POINT_REFRESH_INTERVAL_SEC'/g, process.env.POINT_REFRESH_INTERVAL_SEC || 60, 'src/config.ts');
}

function replaceDittoConfig() {
  shell.sed('-i', /\$DITTO_BASEURL/g, process.env.DITTO_BASEURL|| '', 'src/config.ts');
  shell.sed('-i', /\$DITTO_USERNAME/g, process.env.DITTO_USERNAME || '', 'src/config.ts');
  shell.sed('-i', /\$DITTO_PASSWORD/g, process.env.DITTO_PASSWORD || '', 'src/config.ts');
}


function replacePostgresConfig() {
  shell.sed('-i', /\$PG_BASEURL/g, process.env.PG_BASEURL|| '', 'src/config.ts');
  shell.sed('-i', /\$PG_USERNAME/g, process.env.PG_USERNAME || '', 'src/config.ts');
  shell.sed('-i', /\$PG_PASSWORD/g, process.env.PG_PASSWORD || '', 'src/config.ts');
}

const updateEnv = () => {
  let dataDir = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/data/rubix-wires' : './db');
  dotenv.config({ path: `${dataDir}/.env` });
  shell.sed('-i', /\$SECRET_KEY/g, process.env.SECRET_KEY || '__SECRET_KEY__', 'src/config.ts');
  shell.sed('-i', /'\$PORT'/g, process.env.PORT || 1313, 'src/config.ts');
  shell.sed('-i', /\$DATA_DIR/g, dataDir, 'src/config.ts');
  shell.sed('-i', /'\$LOOP_INTERVAL'/g, process.env.LOOP_INTERVAL || 100, 'src/config.ts');
  replaceBackend();
  replaceRubixInfo();
  replaceBSA();
  replaceDittoConfig();
  replacePostgresConfig();
};

updateEnv();
