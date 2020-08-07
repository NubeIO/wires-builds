const config = {
  secretKey   : '$SECRET_KEY',
  port        : '$PORT',
  dataDir     : '$DATA_DIR',
  loopInterval: '$LOOP_INTERVAL',
  backendSync : {
    enabled                    : '$BACKEND_ENABLED',
    baseUrl                    : '$BACKEND_API',
    nodeRefreshIntervalSeconds : '$NODE_REFRESH_INTERVAL_SEC',
    pointRefreshIntervalSeconds: '$POINT_REFRESH_INTERVAL_SEC',
    nodeDistance               : '$NODE_DISTANCE',
  },
  rubix       : {
    branch : '$RUBIX_BRANCH',
    build  : '$RUBIX_BUILD',
    hash   : '$RUBIX_HASH',
    version: '$RUBIX_VERSION',
  },
  bsa         : {
    baseURL : '$BSA_BASEURL',
    username: '$BSA_USERNAME',
    password: '$BSA_PASSWORD',
    paths   : {
      measurement: {
        path  : '$BSA_PATHS_MEASUREMENT_PATH',
        accept: '$BSA_PATHS_MEASUREMENT_ACCEPT',
      },
      alarm      : {
        path       : '$BSA_PATHS_ALARM_PATH',
        accept     : '$BSA_PATHS_ALARM_ACCEPT',
        contentType: '$BSA_PATHS_ALARM_CONTENTTYPE',
      },
      device     : {
        path: '$BSA_PATHS_DEVICE_PATH',
      },
    },
  },
};

const footerPrefix = `-${config.rubix.hash}${config.rubix.build && `-${config.rubix.build}`}`;

export const footerInfo = `v${config.rubix.version}${footerPrefix}`;

export default config;
