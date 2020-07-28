const { ensureDirectoryExistence } = require('./fileUtils');

const dotenv = require('dotenv');
const shell  = require('shelljs');

ensureDirectoryExistence('src');
shell.cp('-Rf', 'app.config.ts', 'src/config.ts');

const updateEnv = () => {
  dotenv.config();
  let dataDir = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/data/rubix-wires' : './db');
  let backendEnabled = (/true|1/i).test(process.env.BACKEND_ENABLED || 'false');
  shell.sed('-i', /\$SECRET_KEY/g, process.env.SECRET_KEY || '__SECRET_KEY__', 'src/config.ts');
  shell.sed('-i', /'\$PORT'/g, process.env.PORT || 1313, 'src/config.ts');
  shell.sed('-i', /\$DATA_DIR/g, dataDir, 'src/config.ts');
  shell.sed('-i', /'\$LOOP_INTERVAL'/g, process.env.LOOP_INTERVAL || 100, 'src/config.ts');
  shell.sed('-i', /'\$BACKEND_ENABLED'/g, backendEnabled.toString(), 'src/config.ts');
  shell.sed('-i', /\$BACKEND_API/g, process.env.BACKEND_API || 'http://localhost:8080/api/', 'src/config.ts');
  shell.sed('-i', /'\$NODE_DISTANCE'/g, process.env.NODE_DISTANCE || 60, 'src/config.ts');
  shell.sed('-i', /'\$NODE_REFRESH_INTERVAL_SEC'/g, process.env.NODE_REFRESH_INTERVAL_SEC || 60, 'src/config.ts');
  shell.sed('-i', /'\$POINT_REFRESH_INTERVAL_SEC'/g, process.env.POINT_REFRESH_INTERVAL_SEC || 60, 'src/config.ts');
};

updateEnv();
