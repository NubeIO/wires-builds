const { ensureDirectoryExistence } = require('./fileUtils');

const dotenv = require('dotenv');
const shell = require('shelljs');

ensureDirectoryExistence('src');
shell.cp('-Rf', 'app.config.ts', 'src/config.ts');

const updateEnv = () => {
  dotenv.config();
  shell.sed('-i', /\$SECRET_KEY/g, process.env.SECRET_KEY || '__SECRET_KEY__', 'src/config.ts');
  shell.sed('-i', /'\$PORT'/g, process.env.PORT || 1313, 'src/config.ts');
  shell.sed(
    '-i',
    /\$DATA_DIR/g,
    process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/data/rubix-wires' : './db'),
    'src/config.ts',
  );
  shell.sed('-i', /'\$LOOP_INTERVAL'/g, process.env.LOOP_INTERVAL || 100, 'src/config.ts');
};

updateEnv();
