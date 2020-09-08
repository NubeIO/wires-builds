const { ensureDirectoryExistence } = require('./fileUtils');

const dotenv = require('dotenv');
const shell = require('shelljs');
const pjson = require('../package.json');
const configDestinationFile = 'src/config.js';
const configDestinationDistFile = 'dist/config.js';

ensureDirectoryExistence('src');
ensureDirectoryExistence('dist');
shell.cp('-Rf', 'app.config.js', configDestinationFile);

const replaceRubixInfo = () => {
  shell.sed('-i', /\$RUBIX_VERSION/g, process.env.RUBIX_VERSION || pjson.version, configDestinationFile);
  const branchHash = shell.exec('git rev-parse --short HEAD').replace(/[\W]+/g, '');
  const branch = shell.exec("git branch | grep \\* | cut -d ' ' -f2").replace(/[\n]+/g, '');
  shell.sed('-i', /\$RUBIX_HASH/g, process.env.RUBIX_HASH || branchHash, configDestinationFile);
  shell.sed('-i', /\$RUBIX_BRANCH/g, process.env.RUBIX_BRANCH || branch, configDestinationFile);
  shell.sed('-i', /\$RUBIX_BUILD/g, process.env.RUBIX_BUILD || '', configDestinationFile);
};

function replaceBSA() {
  shell.sed('-i', /\$BSA_BASEURL/g, process.env.BSA_BASEURL || '', configDestinationFile);
  shell.sed('-i', /\$BSA_USERNAME/g, process.env.BSA_USERNAME || '', configDestinationFile);
  shell.sed('-i', /\$BSA_PASSWORD/g, process.env.BSA_PASSWORD || '', configDestinationFile);
  shell.sed('-i', /\$BSA_PATHS_MEASUREMENT_PATH/g, process.env.BSA_PATHS_MEASUREMENT_PATH || '', configDestinationFile);
  shell.sed(
    '-i',
    /\$BSA_PATHS_MEASUREMENT_ACCEPT/g,
    process.env.BSA_PATHS_MEASUREMENT_ACCEPT || '',
    configDestinationFile,
  );
  shell.sed('-i', /\$BSA_PATHS_ALARM_PATH/g, process.env.BSA_PATHS_ALARM_PATH || '', configDestinationFile);
  shell.sed('-i', /\$BSA_PATHS_ALARM_ACCEPT/g, process.env.BSA_PATHS_ALARM_ACCEPT || '', configDestinationFile);
  shell.sed(
    '-i',
    /\$BSA_PATHS_ALARM_CONTENTTYPE/g,
    process.env.BSA_PATHS_ALARM_CONTENTTYPE || '',
    configDestinationFile,
  );
  shell.sed('-i', /\$BSA_PATHS_DEVICE_PATH/g, process.env.BSA_PATHS_DEVICE_PATH || '', configDestinationFile);
}

function replaceBackend() {
  let backendEnabled = /true|1/i.test(process.env.BACKEND_ENABLED || 'false');
  shell.sed('-i', /'\$BACKEND_ENABLED'/g, backendEnabled.toString(), configDestinationFile);
  shell.sed('-i', /\$BACKEND_API/g, process.env.BACKEND_API || 'http://localhost:8080/api/', configDestinationFile);
  shell.sed('-i', /'\$NODE_DISTANCE'/g, process.env.NODE_DISTANCE || 60, configDestinationFile);
  shell.sed('-i', /'\$NODE_REFRESH_INTERVAL_SEC'/g, process.env.NODE_REFRESH_INTERVAL_SEC || 60, configDestinationFile);
  shell.sed(
    '-i',
    /'\$POINT_REFRESH_INTERVAL_SEC'/g,
    process.env.POINT_REFRESH_INTERVAL_SEC || 60,
    configDestinationFile,
  );
}

function replaceDittoConfig() {
  shell.sed('-i', /\$DITTO_BASEURL/g, process.env.DITTO_BASEURL || '', configDestinationFile);
  shell.sed('-i', /\$DITTO_USERNAME/g, process.env.DITTO_USERNAME || '', configDestinationFile);
  shell.sed('-i', /\$DITTO_PASSWORD/g, process.env.DITTO_PASSWORD || '', configDestinationFile);
}

function replacePostgresConfig() {
  shell.sed('-i', /\$PG_BASEURL/g, process.env.PG_BASEURL || '', configDestinationFile);
}

function replaceInfluxDbConfig() {
  shell.sed(
    '-i',
    /\$INFLUX_DB_PROTOCOL/g,
    process.env.INFLUX_DB_PROTOCOL === 'https' ? 'https' : 'http',
    configDestinationFile,
  );
  shell.sed('-i', /\$INFLUX_DB_HOST/g, process.env.INFLUX_DB_HOST || 'localhost', configDestinationFile);
  shell.sed('-i', /'\$INFLUX_DB_PORT'/g, process.env.INFLUX_DB_PORT || 8086, configDestinationFile);
  shell.sed('-i', /\$INFLUX_DB_DB_NAME/g, process.env.INFLUX_DB_DB_NAME || 'db', configDestinationFile);
  shell.sed('-i', /\$INFLUX_DB_USERNAME/g, process.env.INFLUX_DB_USERNAME || '', configDestinationFile);
  shell.sed('-i', /\$INFLUX_DB_PASSWORD/g, process.env.INFLUX_DB_PASSWORD || '', configDestinationFile);
}

function replaceEdge28Config() {
  shell.sed('-i', /\$EDGE_28_BASEURL/g, process.env.EDGE_28_BASEURL || '', configDestinationFile);
  shell.sed('-i', /'\$EDGE_28_PORT'/g, process.env.EDGE_28_PORT || 5000, configDestinationFile);
  shell.sed('-i', /\$EDGE_28_API_VER/g, process.env.EDGE_28_API_VER || '', configDestinationFile);
}


function replaceMQTTConfig() {
  shell.sed(
    '-i',
    /\$MQTT_PROTOCOL/g,
    process.env.MQTT_PROTOCOL === 'https' ? 'https' : 'http',
    configDestinationFile,
  );
  shell.sed('-i', /\$MQTT_HOST/g, process.env.MQTT_HOST || 'localhost', configDestinationFile);
  shell.sed('-i', /'\$MQTT_PORT'/g, process.env.MQTT_PORT || 1883, configDestinationFile);
  shell.sed('-i', /\$MQTT_USERNAME/g, process.env.MQTT_USERNAME || '', configDestinationFile);
  shell.sed('-i', /\$MQTT_PASSWORD/g, process.env.MQTT_PASSWORD || '', configDestinationFile);
}

const updateEnv = () => {
  let dataDir = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/data/rubix-wires' : './db');
  dotenv.config({ path: `${dataDir}/.env` });
  shell.sed('-i', /\$SECRET_KEY/g, process.env.SECRET_KEY || '__SECRET_KEY__', configDestinationFile);
  shell.sed('-i', /'\$PORT'/g, process.env.PORT || 1313, configDestinationFile);
  shell.sed('-i', /\$DATA_DIR/g, dataDir, configDestinationFile);
  shell.sed('-i', /'\$LOOP_INTERVAL'/g, process.env.LOOP_INTERVAL || 100, configDestinationFile);
  replaceBackend();
  replaceRubixInfo();
  replaceBSA();
  replaceDittoConfig();
  replacePostgresConfig();
  replaceInfluxDbConfig();
  replaceEdge28Config();
  replaceMQTTConfig();
};

updateEnv();
shell.cp('-Rf', configDestinationFile, configDestinationDistFile);
