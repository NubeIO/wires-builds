const { deleteFolderRecursive, ensureDirectoryExistence } = require('./fileUtils');
const archiver = require('archiver');
const admzip = require('adm-zip');
const fs = require('fs');
const shell = require('shelljs');
const pjson = require('../package.json');

const outputFile = pjson.name;
const workingFolder = 'out';
const outputFolder = 'snapshot';

const copyProductionFiles = () => {
  shell.echo('Copying Production Files...');
  deleteFolderRecursive(workingFolder);
  ensureDirectoryExistence(workingFolder);
  ensureDirectoryExistence(`${workingFolder}/src`); // for config.js store on `node buildSrc/updateEnv.js`
  shell.cp('-Rf', './buildSrc', `${workingFolder}`);
  shell.cp('-Rf', './dist', workingFolder);
  shell.cp('-Rf', './node_modules', workingFolder);
  shell.cp('-Rf', './static-files', workingFolder);
  shell.cp('-Rf', './app.config.js', workingFolder);
  shell.cp('-Rf', './config.json', workingFolder);
  shell.cp('-Rf', './package.json', workingFolder);
  shell.cp('-Rf', './tsconfig.json', workingFolder);
  shell.cp('-Rf', './webpack.config.js', workingFolder);
  shell.cp('-Rf', './script.bash', workingFolder);
};

const x86BuildDependencyUpdate = () => {
  shell.echo('Updating x86 build dependency...');
  const zip = new admzip('buildSrc/@serialport.zip');
  zip.extractAllTo(`${workingFolder}/node_modules/`, true);
};

const packageArchive = () => {
  shell.echo('Archiving server...');
  deleteFolderRecursive(outputFolder);
  const zipFile = `${outputFile}-${pjson.version}`;
  const outputPath = `./${outputFolder}/${zipFile}.zip`;
  ensureDirectoryExistence(outputFolder);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  output.on('close', () => {
    shell.echo(`${archive.pointer()} total bytes`);
    shell.echo('Finished archiving.');
  });

  archive.on('warning', err => {
    if (err.code === 'ENOENT') {
      shell.echo(`Warning: ${err.message}`);
      shell.echo('');
    } else {
      shell.echo(`Warning: ${err.message}`);
      throw err;
    }
  });

  archive.on('error', err => {
    shell.echo(`Error: ${err.message}`);
    throw err;
  });
  archive.pipe(output);
  archive.directory('out', zipFile, null);
  archive.finalize();
};

if (process.env.NODE_ENV === 'production') {
  copyProductionFiles();
  // target === 'x86' includes prebuild files supported by x86 bit of machine
  if (process.env.npm_config_target === 'x86') {
    x86BuildDependencyUpdate();
  }
  packageArchive();
}
